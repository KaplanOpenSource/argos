import argparse
from datetime import datetime
import os
import re
import json
from flask import Flask, send_from_directory, request, redirect, url_for
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

EXPERIMENTS_PATH = "data/experiments"
UPLOAD_FOLDER = "data/uploads"
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
    return app.send_static_file(path)


@app.route("/experiment_list")
def experimentListReq():
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
    if validate_name(name):
        if os.path.exists(os.path.join(EXPERIMENTS_PATH, name + ".json")):
            return send_from_directory(EXPERIMENTS_PATH, name + ".json")
    return {"error": "unknown experiment name"}


@app.route("/experiment_set/<name>", methods=["POST"])
def experimentSetReq(name):
    if not validate_name(name):
        return {"error": "invalid experiment name"}

    json_str = request.get_data()
    oldpath = os.path.join(EXPERIMENTS_PATH, name + ".json")
    if json_str == b"":  # undefined was received
        if os.path.exists(oldpath):
            os.remove(oldpath)
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
    with open(os.path.join(EXPERIMENTS_PATH, new_name + ".json"), "w") as file:
        file.write(str)

    images_data = json_data.get("imageStandalone", [])
    images = [os.path.basename(im["url"]) for im in images_data if "url" in im]
    exp_img_folder = os.path.join(UPLOAD_FOLDER, new_name)
    if os.path.exists(exp_img_folder):
        for f in os.listdir(exp_img_folder):
            if f not in images:
                os.remove(os.path.join(exp_img_folder, f))

    return {"ok": True}


@app.route("/upload", methods=["POST"])
def upload():
    imageName = request.form.get("imageName")
    experimentName = request.form.get("experimentName")
    if not validate_name(experimentName) or not validate_name(imageName):
        return {"error": "invalid image name or experiment name"}

    if "file" not in request.files:  # check if the post request has the file part
        return {"error": "No file part"}
    file = request.files["file"]
    ext = os.path.splitext(file.filename)[1] if file is not None else ""
    if ext not in ALLOWED_EXTENSIONS:
        return {"error": "File not allowed"}

    ts = datetime.now().isoformat().replace("-", "").replace(".", "_")
    filename = secure_filename(imageName + "_" + ts + ext)
    # filenames = filenames_for_image(experimentName, imageName)
    # for f in filenames:
    #     os.remove(f)

    # basename = imageName + "_" + ts + ext
    exp_folder = os.path.join(UPLOAD_FOLDER, experimentName)
    filepath = os.path.join(exp_folder, filename)
    print("saving: " + filepath)
    os.makedirs(exp_folder, exist_ok=True)
    file.save(filepath)
    url = url_for("download_file", experimentName=experimentName, filename=filename)
    return {"url": url}


@app.route("/uploads/<experimentName>/<filename>")
def download_file(experimentName, filename):
    if not validate_name(experimentName):
        return {"error": "invalid experiment name"}
    if filename != secure_filename(filename):
        return {"error": "unable to find image"}
    filepath = os.path.join(UPLOAD_FOLDER, experimentName, filename)
    if not os.path.exists(filepath):
        return {"error": "invalid image name"}

    # filenames = filenames_for_image(experimentName, imageName)
    # if len(filenames) == 0:

    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


if __name__ == "__main__":  # pragma: no cover
    print(experimentListReq())
    app.run(host="0.0.0.0", port=int(args.port))
