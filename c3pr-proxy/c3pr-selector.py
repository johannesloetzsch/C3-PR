#!/usr/bin/python3

from mitmproxy import http
from mitmproxy import ctx
import hashlib
from datetime import datetime, timedelta

entry_site_hdr = """
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C3PR Proxy</title>
</head>

<body>
    <main>
"""

entry_site_footer = """
    </main>
    <footer>
        <p>
        C3PR presented by <a href="https://www.c3d2.de">C3D2</a>
        </p>
    </footer>

</body>

</html>
"""

timeout = timedelta(minutes=1)

class C3PRController:
    def __init__(self):
        self.robots = {
            # name  : (SIP, Hash, TIP, Timestamp)
            "Blue" : (None, None, "192.168.100.132", datetime.now()),
            "Green" : (None, None, "192.168.100.184", datetime.now()),
            "Orange" : (None, None, "192.168.100.181", datetime.now()),
            "Yellow" : (None, None, "192.168.100.180", datetime.now()),
            "White" : (None, None, "192.168.100.140", datetime.now()),
            "Honky0" : (None, None, "192.168.100.182", datetime.now()),
            "Honky1" : (None, None, "192.168.100.179", datetime.now()),
            "Honky11" : (None, None, "192.168.100.162", datetime.now())
        }

    def __generate_entry_side_body(self, flow):
        bdy = "<table>\n"
        bdy += "<tr>\n"
        bdy += "<th>Name</th><th>User IP</th><th>User Agent Hash</th>\n"
        bdy += "<tr>\n"
        for n, c in self.robots.items():
            bdy += "<tr>\n"
            bdy += "<td>{}</td><td>{}</td><td>{}</td>\n".format(n, c[0], c[1])
            bdy += "<td>\n"
            if c[0]:
                bdy += "Occupied"
            else:
                bdy += '<form action="" method="post">'
                bdy += '<input type="submit" name="robot" value="{}" />'.format(n)
                bdy += '</form>\n'
            bdy += "</td>\n"
            bdy += "</tr>\n"
        bdy += "</table>\n"
        return bdy
    
    def __get_robo_name(self, flow):
        h = hashlib.sha1()
        ua = flow.request.headers["User-Agent"]
        h.update(ua.encode('utf-8') if ua else "")
        sip = flow.client_conn.address[0]
        for name, con in self.robots.items():
            tip = self.robots[name][2]
            if con[0] == sip and con[1] == h.hexdigest():
                # update time-stamp
                self.robots[name] = (sip, h.hexdigest(), tip, datetime.now())
                return name
            if (con[3] + timeout) < datetime.now():
                self.robots[name] = (None, None, tip, datetime.now())
        return None

    def __add_robo_control(self, robo, flow):
        h = hashlib.sha1()
        ua = flow.request.headers["User-Agent"]
        h.update(ua.encode('utf-8') if ua else "")
        sip = flow.client_conn.address[0]
        tip = self.robots[robo][2]
        self.robots[robo] = (sip, h.hexdigest(), tip, datetime.now())

    def __modify_request__(self, flow, robot):
        port = 81 if flow.request.pretty_url.endswith("/stream") else 80
        flow.request = http.HTTPRequest.make(
            "GET",
            "http://{}:{}{}".format(robot[2], port, flow.request.path))
        ctx.log.info(flow.request.pretty_url)

    def request(self, flow):
        robo_name = self.__get_robo_name(flow)
        if robo_name and (flow.request.path.startswith("/stream") or flow.request.path.startswith("/control")):
            # found matching roboter assignment
            robot = self.robots[robo_name]
            flow.request.host = robot[2]
            self.__modify_request__(flow, robot)
            return

        if flow.request.method == "POST":
            # processing request for roboter assignment
            if flow.request.content:
                ctx.log.info("ALLOCATE")
                ctx.log.info("Request content: {}".format(flow.request.content))
                kv = flow.request.content.decode('utf-8')
                v = kv.split('=')
                if len(v) == 2:
                    for name in self.robots.keys():
                        if name == v[1]:
                            self.__add_robo_control(name, flow)
                            robot = self.robots[name]
                            flow.request.host = robot[2]
                            self.__modify_request__(flow, robot)
                            return

        # proxy landing page
        if flow.request.path == "/landing":
            flow.response = http.HTTPResponse.make(
                200,
                entry_site_hdr + self.__generate_entry_side_body(flow) + entry_site_footer,
                {"content-type":"text/html"})
            return

        # static ui
        flow.request = http.HTTPRequest.make("GET",
            "http://{}:{}{}"
            .format("localhost", 3000, flow.request.path))
        ctx.log.info(flow.request.path)
        return

    def responseheaders(self, flow):
        if flow.request.pretty_url.endswith("/stream"):
            flow.response.stream = True

addons = [
    C3PRController()
]

