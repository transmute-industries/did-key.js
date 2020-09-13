/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
import base64url from 'base64url-universal';

import * as recAlgorithm from './algorithms/recommended';
import { TextDecoder, stringToUint8Array } from './util';

// support `C20P` for backwards compatibility
import * as c20p from './algorithms/c20p';

const CIPHER_ALGORITHMS: any = {
  [recAlgorithm.cipher.JWE_ENC]: recAlgorithm.cipher,
  // backwards compatibility for decryption only (*not* encryption)
  [c20p.JWE_ENC]: c20p,
};

// only supported key algorithm
const KEY_ALGORITHM = 'ECDH-ES+A256KW';

export class DecryptTransformer {
  public keyAgreement: any;
  public keyAgreementKey: any;
  constructor({ keyAgreement, keyAgreementKey }: any = {}) {
    if (!keyAgreement) {
      throw new TypeError('"keyAgreement" is a required parameter.');
    }
    if (!keyAgreementKey) {
      throw new TypeError('"keyAgreementKey" is a required parameter.');
    }
    this.keyAgreement = keyAgreement;
    this.keyAgreementKey = keyAgreementKey;
  }

  async transform(chunk: any, controller: any) {
    // assumes `chunk` is an object with a JWE under the `jwe` property
    if (!(chunk && typeof chunk === 'object')) {
      throw new TypeError('"chunk" must be an object.');
    }
    const { jwe } = chunk;

    const data = await this.decrypt(jwe);
    if (data === null) {
      const error = new Error('Invalid decryption key.');
      error.name = 'DataError';
      throw error;
    }

    controller.enqueue(data);
  }

  async decrypt(jwe: any) {
    // validate JWE
    if (!(jwe && typeof jwe === 'object')) {
      throw new TypeError('"jwe" must be an object.');
    }
    if (typeof jwe.protected !== 'string') {
      throw new TypeError('"jwe.protected" is missing or not a string.');
    }
    if (typeof jwe.iv !== 'string') {
      throw new Error('Invalid or missing "iv".');
    }
    if (typeof jwe.ciphertext !== 'string') {
      throw new Error('Invalid or missing "ciphertext".');
    }
    if (typeof jwe.tag !== 'string') {
      throw new Error('Invalid or missing "tag".');
    }

    // validate encryption header
    let header;
    let additionalData;
    try {
      // ASCII(BASE64URL(UTF8(JWE Protected Header)))
      additionalData = stringToUint8Array(jwe.protected);
      header = JSON.parse(
        new TextDecoder().decode(base64url.decode(jwe.protected))
      );
    } catch (e) {
      throw new Error('Invalid JWE "protected" header.');
    }
    if (!(header.enc && typeof header.enc === 'string')) {
      throw new Error('Invalid JWE "enc" header.');
    }
    const cipher = CIPHER_ALGORITHMS[header.enc];
    if (!cipher) {
      throw new Error('Unsupported encryption algorithm "${header.enc}".');
    }
    if (!Array.isArray(jwe.recipients)) {
      throw new TypeError('"jwe.recipients" must be an array.');
    }

    // find `keyAgreementKey` matching recipient
    const { keyAgreementKey } = this;
    const recipient = _findRecipient(jwe.recipients, keyAgreementKey);
    if (!recipient) {
      throw new Error('No matching recipient found for key agreement key.');
    }
    // get wrapped CEK
    const { encrypted_key: wrappedKey } = recipient;
    if (typeof wrappedKey !== 'string') {
      throw new Error('Invalid or missing "encrypted_key".');
    }

    // TODO: consider a cache of encrypted_key => CEKs to reduce unwrapping
    // calls which may even need to hit the network (e.g., Web KMS)

    // derive KEK and unwrap CEK
    const { epk } = recipient.header;
    const { keyAgreement } = this;
    const { kek } = await keyAgreement.kekFromEphemeralPeer({
      keyAgreementKey,
      epk,
    });
    const cek = await kek.unwrapKey({ wrappedKey });
    if (!cek) {
      // failed to unwrap key
      return null;
    }

    // decrypt content
    const { ciphertext, iv, tag } = jwe;
    return cipher.decrypt({
      ciphertext: base64url.decode(ciphertext),
      iv: base64url.decode(iv),
      tag: base64url.decode(tag),
      additionalData,
      cek,
    });
  }
}

function _findRecipient(recipients: any, key: any) {
  return recipients.find(
    (e: any) =>
      e.header &&
      e.header.kid === key.id &&
      !key.algorithm &&
      e.header.alg === KEY_ALGORITHM
  );
}
