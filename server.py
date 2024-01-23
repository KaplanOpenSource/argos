import argparse
import os
import re
from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin


parser = argparse.ArgumentParser()
parser.add_argument("--port", default=8080, help="needs to be synced with client port, look at client/src/constants.js")
parser.add_argument("--prod", action="store_true", help="Flag this on production deployment, disallows cors")
args = parser.parse_args()
print(args)

app = Flask(__name__, static_url_path="/", static_folder="client/dist")
# template_folder='web/templates')

cors_origins = '*'
if args.prod:
    cors_origins = []
cors = CORS(app, origins=cors_origins)


@app.route("/")
def index_func():
    return app.send_static_file("index.html")


@app.route("/<path:path>")
def static_file(path):
    return app.send_static_file(path)


if __name__ == "__main__":  # pragma: no cover
    app.run(host="0.0.0.0", port=int(args.port))
