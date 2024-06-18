from datetime import datetime
import os
from werkzeug.utils import secure_filename

from py.constants import ALLOWED_EXTENSIONS, UPLOAD_FOLDER
from py.utils import validate_name


class Images:
    def upload(self, imageName, experimentName, file):
        if not validate_name(experimentName) or not validate_name(imageName):
            return {"error": "invalid image name or experiment name"}

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

    def download(self, experimentName, filename):
        if not validate_name(experimentName):
            return {"error": "invalid experiment name"}
        if filename != secure_filename(filename):
            return {"error": "unable to find image"}
        filepath = os.path.join(UPLOAD_FOLDER, experimentName, filename)
        if not os.path.exists(filepath):
            return {"error": "invalid image name"}
        return {"filepath": filepath}
