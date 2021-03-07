import {
  KeyPair as WebKeyPair,
  key,
  encoding,
} from '@transmute/web-crypto-key-pair';

import {
  GenerateKeyOpts,
  JsonWebKey2020,
} from '@transmute/web-crypto-key-pair/dist/types';

import { multicodecToJwk } from './identifiers';

export class KeyPair extends WebKeyPair {
  static async fingerprintFromPublicKey(publicKey: JsonWebKey2020) {
    if (!publicKey.publicKeyJwk) {
      throw new Error(
        'No support for public key: ' + JSON.stringify(publicKey)
      );
    }
    return key.getMulticodec(publicKey.publicKeyJwk);
  }

  static from = async (keypair: JsonWebKey2020) => {
    const kp = await WebKeyPair.from(keypair);
    return new KeyPair(kp);
  };

  static fromFingerprint = async (opts: { fingerprint: string }) => {
    const publicKeyJwk = await multicodecToJwk(opts.fingerprint);
    return KeyPair.from({
      id: `#${opts.fingerprint}`,
      type: 'JsonWebKey2020',
      controller: `did:key:${opts.fingerprint}`,
      publicKeyJwk,
    });
  };

  static generate = async (opts?: GenerateKeyOpts) => {
    const kp = await WebKeyPair.generate(opts);
    const fingerprint = await KeyPair.fingerprintFromPublicKey({
      publicKeyJwk: await key.getJwkFromCryptoKey(kp.publicKey),
    } as any);
    return new KeyPair({
      id: `#${fingerprint}`,
      type: kp.type,
      controller: kp.controller,
      publicKey: kp.publicKey,
      privateKey: kp.privateKey,
    });
  };

  async fingerprint() {
    return key.getMulticodec(await key.getJwkFromCryptoKey(this.publicKey));
  }

  async toKeyPair(exportPrivateKey = false) {
    const publicKeyJwk: any = await key.getJwkFromCryptoKey(this.publicKey);
    let options: any = {
      id: this.id,
      type: 'JsonWebKey2020',
      controller: this.controller,
      publicKeyBase58: encoding.base58.encode(
        Buffer.concat([
          Buffer.from(publicKeyJwk.x, 'base64'),
          Buffer.from(publicKeyJwk.y, 'base64'),
        ])
      ),
    };
    if (exportPrivateKey && this.privateKey) {
      const privateKeyJwk: any = await key.getJwkFromCryptoKey(this.privateKey);
      options.privateKeyBase58 = encoding.base58.encode(
        Buffer.from(privateKeyJwk.d, 'base64')
      );
    }
    return options;
  }
}
