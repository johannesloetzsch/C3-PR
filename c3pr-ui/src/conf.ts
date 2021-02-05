import {Options} from 'jsqr'

export const iframe_origin:string = "https://matter.crockefeller.org/wille-berg/entrance"

export const pingbot_hashed_useragent = "5ed6f5c30b85e76f361baef42ae484005953538c"  // sha1('python-requests/2.25.0')

export const autoLogoutTime_ms = 60*1000

export const debug:Boolean = false

export const url_control:string = "/control"
export const url_stream:string = "/stream"

export const qr_interval:number = 1000
export const qr_args:Options = {inversionAttempts: "dontInvert"}
