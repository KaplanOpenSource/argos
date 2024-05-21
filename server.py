import argparse
from datetime import datetime
import os
import re
import json
import shutil
import uuid
from flask import Flask, send_from_directory, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

DATA_FOLDER = "data"
EXPERIMENTS_PATH = os.path.join(DATA_FOLDER, "experiments")
UPLOAD_FOLDER = os.path.join(DATA_FOLDER, "uploads")
USERS_FILE = os.path.join(DATA_FOLDER, "users.json")
ALLOWED_EXTENSIONS = {".txt", ".png", ".jpg", ".jpeg", ".gif"}

parser = argparse.ArgumentParser()
parser.add_argument("--port", default=8080, help="needs to be synced with client port, look at client/src/constants.js")
parser.add_argument("--prod", action="store_true", help="Flag this on production deployment, disallows cors")
args = parser.parse_args()
print(args)

app = Flask(__name__, static_url_path="/", static_folder="client/dist")
# template_folder='web/templates')

cors_origins = "*"
if args.prod:
    cors_origins = []
cors = CORS(app, origins=cors_origins)


@app.route("/")
def index_func():
    return app.send_static_file("index.html")


@app.route("/<path:path>")
def static_file(path):
    if not validate_token():
        return {"error": "not logged in"}
    return app.send_static_file(path)


@app.route("/experiment_list")
def experimentListReq():
    if not validate_token():
        return {"error": "not logged in"}
    return obtainExperimentList()


def obtainExperimentList():
    if not os.path.exists(EXPERIMENTS_PATH):
        return []

    def namekey(n):
        sn = os.path.splitext(n)[0]
        pos = re.search(r"[ 0-9]+$", sn)
        num = 0
        if pos is not None:
            spos = pos.group().strip()
            if len(spos) > 0:
                num = int(pos.group())
                sn = sn[0 : pos.start()]
        return (sn, num)

    names = sorted(os.listdir(EXPERIMENTS_PATH), key=namekey)
    for n in names:
        print(n)
    names = [os.path.splitext(n)[0] for n in names]
    return names


def validate_name(name: str) -> bool:
    return name is not None and len(name) > 0 and re.match("^[0-9a-zA-Z_\- ]+$", name)


@app.route("/experiment/<name>")
def experimentGetReq(name):
    if not validate_token():
        return {"error": "not logged in"}
    if validate_name(name):
        if os.path.exists(os.path.join(EXPERIMENTS_PATH, name + ".json")):
            return send_from_directory(EXPERIMENTS_PATH, name + ".json")
    return {"error": "unknown experiment name"}


@app.route("/experiment_set/<name>", methods=["POST"])
def experimentSetReq(name):
    if not validate_token():
        return {"error": "not logged in"}
    if not validate_name(name):
        return {"error": "invalid experiment name"}

    json_str = request.get_data()
    oldpath = os.path.join(EXPERIMENTS_PATH, name + ".json")
    if json_str == b"":  # undefined was received
        if os.path.exists(oldpath):
            os.remove(oldpath)
        if os.path.exists(os.path.join(UPLOAD_FOLDER, name)):
            shutil.rmtree(os.path.join(UPLOAD_FOLDER, name))
        return {"ok": True}

    json_data = json.loads(json_str)
    str = json.dumps(json_data, indent=2)
    new_name = json_data["name"]
    if new_name is None:
        new_name = name

    if not validate_name(new_name):
        return {"error": "invalid new experiment name"}

    os.makedirs(EXPERIMENTS_PATH, exist_ok=True)
    if new_name != name:
        if os.path.exists(oldpath):
            os.remove(oldpath)
        if os.path.exists(os.path.join(UPLOAD_FOLDER, name)):
            os.rename(os.path.join(UPLOAD_FOLDER, name), os.path.join(UPLOAD_FOLDER, new_name))
    with open(os.path.join(EXPERIMENTS_PATH, new_name + ".json"), "w") as file:
        file.write(str)

    images_data = json_data.get("imageStandalone", []) + json_data.get("imageEmbedded", [])
    images = [os.path.basename(im["filename"]) for im in images_data if "filename" in im]
    exp_img_folder = os.path.join(UPLOAD_FOLDER, new_name)
    if os.path.exists(exp_img_folder):
        for f in os.listdir(exp_img_folder):
            if f not in images:
                os.remove(os.path.join(exp_img_folder, f))

    return {"ok": True}


@app.route("/upload", methods=["POST"])
def upload():
    if not validate_token():
        return {"error": "not logged in"}
    imageName = request.form.get("imageName")
    experimentName = request.form.get("experimentName")
    if not validate_name(experimentName) or not validate_name(imageName):
        return {"error": "invalid image name or experiment name"}

    if "file" not in request.files:  # check if the post request has the file part
        return {"error": "No file part"}
    file = request.files["file"]
    ext = os.path.splitext(file.filename)[1] if file is not None else ""
    if ext not in ALLOWED_EXTENSIONS:
        return {"error": "File not allowed, ext=" + ext}

    ts = datetime.now().isoformat().replace("-", "").replace(".", "_")
    filename = secure_filename(imageName + "_" + ts + ext)
    exp_folder = os.path.join(UPLOAD_FOLDER, experimentName)
    filepath = os.path.join(exp_folder, filename)
    print("saving: " + filename + " on " + exp_folder)
    os.makedirs(exp_folder, exist_ok=True)
    file.save(filepath)
    # url = url_for("download_file", experimentName=experimentName, filename=filename)
    return {"filename": filename}


@app.route("/uploads/<experimentName>/<filename>")
def download_file(experimentName, filename):
    if not validate_token():
        return {"error": "not logged in"}
    if not validate_name(experimentName):
        return {"error": "invalid experiment name"}
    if filename != secure_filename(filename):
        return {"error": "unable to find image"}
    filepath = os.path.join(UPLOAD_FOLDER, experimentName, filename)
    if not os.path.exists(filepath):
        return {"error": "invalid image name"}

    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


known_users = None
users_login_data = {}


def validate_token():
    token: str = request.args.get("token")
    data = users_login_data.get(token)
    if data is not None:
        now = datetime.now()
        if (now - data.get("lasttime")).total_seconds() > 2 * 60 * 60:
            return False
        if (now - data.get("logintime")).total_seconds() > 24 * 60 * 60:
            return False
        data.set("lasttime", now)
        return True


@app.route("/login")
def login():
    global known_users
    global user_login_data
    username: str = request.args.get("username").strip()
    password: str = request.args.get("password")
    if username is not None and password is not None:
        if known_users is None:
            with open(USERS_FILE) as f:
                known_users = json.load(f)
                # print(known_users)
            if known_users is None or "users" not in known_users:
                print("no users file")
                exit(1)
        for x in known_users["users"]:
            if x.get("username") == username:
                if x.get("password") != password:
                    break
                token = str(uuid.uuid4())
                for k, v in list(users_login_data.items()):
                    if v.get("username") == username:
                        del users_login_data[k]
                users_login_data[token] = {
                    "username": username,
                    "lasttime": datetime.now(),
                    "logintime": datetime.now(),
                }
                return {"token": token}
    return {"error": "wrong login details"}


if __name__ == "__main__":  # pragma: no cover
    print(obtainExperimentList())
    app.run(host="0.0.0.0", port=int(args.port))
