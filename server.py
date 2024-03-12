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
ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif"}

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
    if validate_name(name):
        json_str = request.get_data()

        oldpath = os.path.join(EXPERIMENTS_PATH, name + ".json")

        if json_str == b"":  # undefined was received
            if os.path.exists(oldpath):
                os.remove(oldpath)
            return {"ok": True}
        else:
            json_data = json.loads(json_str)
            str = json.dumps(json_data, indent=2)
            new_name = json_data["name"]
            if new_name is None:
                new_name = name
            if validate_name(new_name):
                os.makedirs(EXPERIMENTS_PATH, exist_ok=True)
                if new_name != name:
                    if os.path.exists(oldpath):
                        os.remove(oldpath)
                with open(os.path.join(EXPERIMENTS_PATH, new_name + ".json"), "w") as file:
                    file.write(str)
                    return {"ok": True}
    return {"error": "invalid experiment name"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:  # check if the post request has the file part
        return {"error": "No file part"}
    file = request.files["file"]
    if file.filename == "":  # If the user does not select a file, the browser submits an empty file without a filename.
        return {"error": "No selected file"}
    if file and allowed_file(file.filename):
        ts = datetime.now().isoformat().replace("-", "").replace(".", "_")
        filename = secure_filename(ts + "_" + file.filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return url_for("download_file", name=filename)
    return {"error": "File not allowed"}


@app.route("/uploads/<name>")
def download_file(name):
    return send_from_directory(UPLOAD_FOLDER, name)


if __name__ == "__main__":  # pragma: no cover
    print(experimentListReq())
    app.run(host="0.0.0.0", port=int(args.port))
