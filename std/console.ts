export function log(msg: string) {
  console.log(msg);
}

export function warn(msg: string) {
  console.warn(msg);
}

export function error(msg: string) {
  console.error(msg);
}

export function info(msg: string) {
  console.info(msg);
}

export function debug(msg: string) {
  console.debug(msg);
}

export function assert(assertion: boolean, msg: string) {
  console.assert(assertion, msg);
}

export function time(msg: string) {
  console.time(msg);
}

export function timeEnd(msg: string) {
  console.timeEnd(msg);
}
