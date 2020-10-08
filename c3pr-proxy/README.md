# C3 Presence Robot Proxy
Plug-in to the [mitmproxy](https://mitmproxy.org) for the management of C3PR. The code was written from friday to sonday late morning of [Datenspuren 2020](https://datenspuren.de/2020).

## Functions

The proxy stores a mapping from sessions to roboters. If an incoming client is not found in the mapping table, an overview page is shown. The overview page allows users to pick free roboters.

If a mapping for an incoming request is found in the mapping table, it is forwarded to the robot.

## Usage

1. Download the mitmproxy binary package.
2. Start application with command line:
   `./mitmproxy -p 9999 --mode reverse:https://christianix.de -s c3pr-selector.py --set block_global=false`
3. Switch to event log for debugging:
   `Shift + 'e'` ('E')

## TODOS

- Replace steaming Port on responses from robot:
  `/~s/baseHost + ':81'/baseHost + ':80'`
- Direct requests for URL ending on 'stream/' to port ':81' of robot
- Send motor stop on time-out
- Cancel reservation on errors

Have fun, [norbert](https://wiki.c3d2.de/Benutzer:Norbert)
