import json
import os
import shutil

from py.config import experiments_path, upload_folder
from py.utils import sort_experiments, validate_name


class Experiments:
    def get_list(self):
        if not os.path.exists(experiments_path()):
            return []

        names = sort_experiments(os.listdir(experiments_path()))
        for n in names:
            print(n)
        names = [os.path.splitext(n)[0] for n in names]
        return names

    def get_exp(self, name: str):
        if not validate_name(name):
            return {"error": "unknown experiment name"}
        filepath = os.path.join(experiments_path(), name + ".json")
        if not os.path.exists(filepath):
            return {"error": "unknown experiment name"}
        return {"filepath": filepath}

    def set_exp(self, name: str, json_str: str):
        if not validate_name(name):
            return {"error": "invalid experiment name"}

        oldpath = os.path.join(experiments_path(), name + ".json")
        if json_str == b"":  # undefined was received
            if os.path.exists(oldpath):
                os.remove(oldpath)
            if os.path.exists(os.path.join(upload_folder(), name)):
                shutil.rmtree(os.path.join(upload_folder(), name))
            return {"ok": True}

        json_data = json.loads(json_str)
        str = json.dumps(json_data, indent=2)
        new_name = json_data["name"]
        if new_name is None:
            new_name = name

        if not validate_name(new_name):
            return {"error": "invalid new experiment name"}

        os.makedirs(experiments_path(), exist_ok=True)
        if new_name != name:
            if os.path.exists(oldpath):
                os.remove(oldpath)
            if os.path.exists(os.path.join(upload_folder(), name)):
                os.rename(os.path.join(upload_folder(), name), os.path.join(upload_folder(), new_name))
        with open(os.path.join(experiments_path(), new_name + ".json"), "w") as file:
            file.write(str)

        images_data = json_data.get("imageStandalone", []) + json_data.get("imageEmbedded", [])
        images = [os.path.basename(im["filename"]) for im in images_data if "filename" in im]
        exp_img_folder = os.path.join(upload_folder(), new_name)
        if os.path.exists(exp_img_folder):
            for f in os.listdir(exp_img_folder):
                if f not in images:
                    image_file_name = os.path.join(exp_img_folder, f)
                    print("removing: ", image_file_name)
                    os.remove(image_file_name)

        return {"ok": True}
