import {encode, decode} from "js-base64";

export function encodeStr(base64: string): string {
  return encode(base64)
}

export function decodeBase64(str: string): string {
  return decode(str)
}
