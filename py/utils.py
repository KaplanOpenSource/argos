import os
import re


def namekey(n):
    sn = os.path.splitext(n)[0]
    pos = re.search(r"[ 0-9]+$", sn)
    num = 0
    if pos is not None:
        spos = pos.group().strip()
        if len(spos) > 0:
            num = int(pos.group())
            sn = sn[0 : pos.start()]
    return (sn, num)


def validate_name(name: str) -> bool:
    return name is not None and len(name) > 0 and re.match("^[0-9a-zA-Z_\- ]+$", name)
