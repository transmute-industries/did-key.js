import * as fs from 'fs';
import * as path from 'path';

const publicKeyJwk = require('./test-vectors/publicKeyJwk.json');
const privateKeyJwk = require('./test-vectors/privateKeyJwk.json');
const header = require('./test-vectors/header.json');
const payload = require('./test-vectors/payload.json');
const didDocument = require('./test-vectors/didDocument.json');

const signature = Buffer.from(
  fs
    .readFileSync(path.resolve(__dirname, './test-vectors/signature.txt'))
    .toString(),
  'base64'
);

const message = Buffer.from(
  fs
    .readFileSync(path.resolve(__dirname, './test-vectors/message.txt'))
    .toString()
);

const publicKeyBase58 = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/publicKeyBase58.txt'))
  .toString();

const privateKeyBase58 = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/privateKeyBase58.txt'))
  .toString();

export {
  publicKeyJwk,
  privateKeyJwk,
  message,
  signature,
  header,
  payload,
  publicKeyBase58,
  privateKeyBase58,
  didDocument,
};
