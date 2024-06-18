import argparse
from datetime import datetime
import os
import re
import json
import shutil
from flask import Flask, send_from_directory, request, redirect, url_for
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from py.constants import ALLOWED_EXTENSIONS, EXPERIMENTS_PATH, UPLOAD_FOLDER
from py.Experiments import Experiments
from py.utils import namekey, validate_name


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

exps = Experiments()


@app.route("/")
def index_func():
    return app.send_static_file("index.html")


@app.route("/<path:path>")
def static_file(path):
    return app.send_static_file(path)


@app.route("/experiment_list")
def experimentListReq():
    return exps.get_list()


@app.route("/experiment/<name>")
def experimentGetReq(name):
    if validate_name(name):
        if os.path.exists(os.path.join(EXPERIMENTS_PATH, name + ".json")):
            return send_from_directory(EXPERIMENTS_PATH, name + ".json")
    return {"error": "unknown experiment name"}


@app.route("/experiment_set/<name>", methods=["POST"])
def experimentSetReq(name):
    json_str = request.get_data()
    return exps.set_exp(name, json_str)


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
    if not validate_name(experimentName):
        return {"error": "invalid experiment name"}
    if filename != secure_filename(filename):
        return {"error": "unable to find image"}
    filepath = os.path.join(UPLOAD_FOLDER, experimentName, filename)
    if not os.path.exists(filepath):
        return {"error": "invalid image name"}

    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


if __name__ == "__main__":  # pragma: no cover
    print(experimentListReq())
    app.run(host="0.0.0.0", port=int(args.port))
