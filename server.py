import argparse
import os
import re
import json
from flask import Flask, send_from_directory, request
from flask_cors import CORS, cross_origin

EXPERIMENTS_PATH = "data/experiments"

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
    names = sorted(os.listdir(EXPERIMENTS_PATH))
    names = [os.path.splitext(n)[0] for n in names]
    return names

def validate_name(name: str) -> bool:
    return name is not None and len(name) > 0 and re.match("^[0-9_a-zA-Z]+$", name) 

@app.route("/experiment/<name>")
def experimentGetReq(name):
    if validate_name(name):
        if os.path.exists(os.path.join(EXPERIMENTS_PATH, name + ".json")):
            return send_from_directory(EXPERIMENTS_PATH, name + ".json")
    return {"error": "unknown experiment name"}


@app.route("/experiment_set/<name>", methods=["POST"])
def experimentSetReq(name):
    if validate_name(name):
        json_data = request.json
        new_name = json_data['name']
        if new_name is None:
            new_name = name
        if validate_name(new_name):
            os.makedirs(EXPERIMENTS_PATH, exist_ok=True)
            str = json.dumps(json_data['data'], indent=2)
            if new_name != name:
                oldpath = os.path.join(EXPERIMENTS_PATH, name + ".json")
                if os.path.exists(oldpath):
                    os.remove(oldpath)
            with open(os.path.join(EXPERIMENTS_PATH, new_name + ".json"), "w") as file:
                file.write(str)
                return {"ok": True}
    return {"error": "invalid experiment name"}


if __name__ == "__main__":  # pragma: no cover
    app.run(host="0.0.0.0", port=int(args.port))
