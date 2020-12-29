#!/usr/bin/which python3

import json
import subprocess
import requests

def check_online(ip, timeout=5):
    ret = subprocess.call(["ping", "-c", "1", "-W", str(timeout), ip])
    return not ret

def allocate(name):
    try:
        requests.post("http://localhost:8080", data="robot=" + name, timeout=1)
    except:
        pass

while True:
    robots = json.load(open("../c3pr-ui/public/robots.json"))
    for r in robots:
        online = check_online(r["ip"])
        if(not online):
            allocate(r["name"])
