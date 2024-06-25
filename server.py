import argparse
from datetime import datetime, timedelta, timezone
import json
import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    unset_jwt_cookies,
)

from py.Images import Images
from py.Experiments import Experiments


parser = argparse.ArgumentParser()
parser.add_argument("--port", default=8080, help="needs to be synced with client port, look at client/src/constants.js")
parser.add_argument("--prod", action="store_true", help="Flag this on production deployment, disallows cors")
args = parser.parse_args()
print(args)

app = Flask(__name__, static_url_path="/", static_folder="client/dist")
# template_folder='web/templates')
app.config["JWT_SECRET_KEY"] = "fa65674f-3afd-45cd-8873-d2180cf3836c"  # TODO: move to file?
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


cors_origins = "*"
if args.prod:
    cors_origins = []
cors = CORS(app, origins=cors_origins)

exps = Experiments()
images = Images()


@app.route("/")
def index_func():
    return app.send_static_file("index.html")


@app.route("/login", methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # TODO: fetch from data/users.json
    if username != "test" or password != "test":
        return {"msg": "Wrong username or password"}, 401

    access_token = create_access_token(identity=username)
    response = jsonify({"access_token": access_token})
    return response


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


@app.route("/<path:path>")
@jwt_required()
def static_file(path):
    return app.send_static_file(path)


@app.route("/experiment_list")
@jwt_required()
def experimentListReq():
    return exps.get_list()


@app.route("/experiment/<name>")
@jwt_required()
def experimentGetReq(name):
    ret = exps.get_exp(name)
    filepath = ret.get("filepath", None)
    if filepath is None:
        return ret
    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


@app.route("/experiment_set/<name>", methods=["POST"])
@jwt_required()
def experimentSetReq(name):
    json_str = request.get_data()
    return exps.set_exp(name, json_str)


@app.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    if "file" not in request.files:  # check if the post request has the file part
        return {"error": "No file part"}
    return images.upload(
        request.form.get("imageName"),
        request.form.get("experimentName"),
        request.files["file"],
    )


@app.route("/uploads/<experimentName>/<filename>")
# @jwt_required()
def download_file(experimentName, filename):
    ret = images.download(experimentName, filename)
    filepath = ret.get("filepath", None)
    if filepath is None:
        return ret
    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))


if __name__ == "__main__":  # pragma: no cover
    print(exps.get_list())
    app.run(host="0.0.0.0", port=int(args.port))
