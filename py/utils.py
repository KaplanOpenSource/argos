import os
import re
from typing import Tuple


def sort_experiments(filenames):
    names = {os.path.splitext(x)[0].strip(): [x] for x in filenames}
    namescopy = [x for x in names.items()]
    for name, filename in namescopy:
        bef, aft = split_before_after(name)
        if bef in names:
            if aft != "":
                try:
                    n = int(aft)
                    names[bef].extend(filename)
                    del names[name]
                    continue
                finally:
                    pass

    sortednames = [x for xs in names.values() for x in xs]
    return sortednames


def split_before_after(s: str, separator: str = " ") -> Tuple[str, str]:
    # Find the position of the last occurrence of the separator
    pos = s.rfind(separator)

    # If there's no separator in the string, return the original string and an empty string
    if pos == -1:
        return s, ""

    # Split the string at the position of the last separator
    before = s[:pos]
    after = s[pos + len(separator) :]

    return before, after


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
