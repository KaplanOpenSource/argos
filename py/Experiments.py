import json
import os
import shutil

from py.constants import EXPERIMENTS_PATH, UPLOAD_FOLDER
from py.utils import namekey, validate_name


class Experiments:
    def get_list(self):
        if not os.path.exists(EXPERIMENTS_PATH):
            return []

        names = sorted(os.listdir(EXPERIMENTS_PATH), key=namekey)
        for n in names:
            print(n)
        names = [os.path.splitext(n)[0] for n in names]
        return names

    def get_exp(self, name: str):
        if not validate_name(name):
            return {"error": "unknown experiment name"}
        filepath = os.path.join(EXPERIMENTS_PATH, name + ".json")
        if not os.path.exists(filepath):
            return {"error": "unknown experiment name"}
        return {"filepath": filepath}

    def set_exp(self, name: str, json_str: str):
        if not validate_name(name):
            return {"error": "invalid experiment name"}

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
