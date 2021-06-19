export { ReadableStream, TransformStream } from 'web-streams-polyfill/ponyfill';

export function stringToUint8Array(data: any) {
  if (typeof data === 'string') {
    // convert data to Uint8Array
    return new Uint8Array(Buffer.from(data));
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError('"data" be a string or Uint8Array.');
  }
  return data;
}
