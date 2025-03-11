from datetime import datetime
import os
from werkzeug.utils import secure_filename
import io
import base64
from PIL import Image

from py.constants import ALLOWED_EXTENSIONS
from py.config import upload_folder
from py.utils import validate_name


class Images:
    def upload(self, imageName: str, experimentName: str, fileName: str, fileData: str):
        if not validate_name(experimentName) or not validate_name(imageName):
            return {"error": "invalid image name or experiment name"}

        ext = os.path.splitext(fileName)[1] if fileName is not None else ""
        if ext not in ALLOWED_EXTENSIONS:
            return {"error": "File not allowed, ext=" + ext}
        ext = '.png'

        ts = datetime.now().isoformat().replace("-", "").replace(".", "_")
        filename_generated = secure_filename(imageName + "_" + ts + ext)
        exp_folder = os.path.join(upload_folder(), experimentName)
        filepath = os.path.join(exp_folder, filename_generated)
        print("saving: " + filename_generated + " on " + exp_folder)
        os.makedirs(exp_folder, exist_ok=True)
        # file.save(filepath)
        # url = url_for("download_file", experimentName=experimentName, filename=filename)
        if not fileData.startswith("data:image/png;base64,"):
            return {"error": "Problem with file data, starts with " + fileData[:30]}

        base64_str = fileData.replace("data:image/png;base64,", "", 1)
        img = Image.open(io.BytesIO(base64.decodebytes(bytes(base64_str, "utf-8"))))
        img.save(filepath)
        return {"filename": filename_generated}

    def download(self, experimentName, filename):
        if not validate_name(experimentName):
            return {"error": "invalid experiment name"}
        if filename != secure_filename(filename):
            return {"error": "unable to find image"}
        filepath = os.path.join(upload_folder(), experimentName, filename)
        if not os.path.exists(filepath):
            return {"error": "invalid image name"}
        return {"filepath": filepath}
