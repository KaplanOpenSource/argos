import argparse
from datetime import datetime
import os
import re
import json
import shutil
from flask import Flask, send_from_directory, request, redirect, url_for
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from py.Images import Images
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
images = Images()


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
    ret = exps.get_exp(name)
    filepath = ret.get("filepath", None)
    if filepath is None:
        return ret
    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


@app.route("/experiment_set/<name>", methods=["POST"])
def experimentSetReq(name):
    json_str = request.get_data()
    return exps.set_exp(name, json_str)


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:  # check if the post request has the file part
        return {"error": "No file part"}
    return images.upload(
        request.form.get("imageName"),
        request.form.get("experimentName"),
        request.files["file"],
    )


@app.route("/uploads/<experimentName>/<filename>")
def download_file(experimentName, filename):
    ret = images.download(experimentName, filename)
    filepath = ret.get("filepath", None)
    if filepath is None:
        return ret
    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


if __name__ == "__main__":  # pragma: no cover
    print(experimentListReq())
    app.run(host="0.0.0.0", port=int(args.port))
