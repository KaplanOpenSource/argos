import json
import os


default_config = {
    "data_folder": "data",
    "tileserver": {
        "url": "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
        "attribution": '&copy; <a href="https://carto.com">Carto</a> contributors',
    },
}

argos_config = dict(default_config)


def read_config():
    try:
        with open("config.json") as fconfig:
            read_config: dict = json.load(fconfig)
            for k, v in read_config.items():
                argos_config[k] = v

    except:
        print("no config file found")

    for k, v in default_config.items():
        if k not in argos_config:
            argos_config[k] = v

    print("argos_config:", argos_config)


def data_folder():
    return argos_config["data_folder"]


def experiments_path():
    return os.path.join(data_folder(), "experiments")


def upload_folder():
    return os.path.join(data_folder(), "uploads")
