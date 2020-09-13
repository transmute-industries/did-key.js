// Node.js TextDecoder/TextEncoder
import { TextDecoder, TextEncoder } from 'util';
export { TextDecoder, TextEncoder };

export { ReadableStream, TransformStream } from 'web-streams-polyfill/ponyfill';

export function stringToUint8Array(data: any) {
  if (typeof data === 'string') {
    // convert data to Uint8Array
    return new TextEncoder().encode(data);
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError('"data" be a string or Uint8Array.');
  }
  return data;
}
