import bs58 from 'bs58';
import { KeyAgreementKeyPairInstance, DeriveSecretOptions } from './types';
import { generate } from './functions/generate';
import { fromJwk } from './functions/fromJwk';

import { deriveSecret } from './Jwe';
import { privateKeyToSigner, publicKeyToVerifier } from './Jws';
import { toJwkPair } from './functions/toJwkPair';

export class KeyPair implements KeyAgreementKeyPairInstance {
  public id: string;
  public type: string;
  public controller: string;
  public publicKeyBuffer: Buffer;
  public privateKeyBuffer?: Buffer;

  static generate = async (options?: any) => {
    const { privateKeyJwk } = await generate(options);
    return new KeyPair({ ...fromJwk(privateKeyJwk) });
  };

  static from = async (options?: any) => {
    return new KeyPair({ ...options });
  };

  constructor(options: any) {
    this.id = options.id;
    this.type = options.type;
    this.controller = options.controller;
    if (options.publicKeyBase58) {
      this.publicKeyBuffer = bs58.decode(options.publicKeyBase58);
    } else if (options.publicKeyJwk) {
      const { publicKeyBase58 } = fromJwk(options.publicKeyJwk);
      this.publicKeyBuffer = bs58.decode(publicKeyBase58);
    } else {
      throw new Error('publicKeyJwk or publicKeyBase58 is required.');
    }

    if (options.privateKeyBase58) {
      this.privateKeyBuffer = bs58.decode(options.privateKeyBase58);
    } else if (options.privateKeyJwk) {
      const { privateKeyBase58 } = fromJwk(options.privateKeyJwk);
      this.privateKeyBuffer = bs58.decode(privateKeyBase58);
    }
  }

  toKeyPair(exportPrivateKey = false) {
    let options: any = {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    };
    if (exportPrivateKey) {
      options.privateKeyBase58 = bs58.encode(this.privateKeyBuffer);
    }
    return options;
  }

  toJsonWebKey(exportPrivateKey = false) {
    const options = this.toKeyPair(exportPrivateKey);
    return toJwkPair(options);
  }

  async signer() {
    const { privateKeyJwk } = this.toJsonWebKey(true);
    return privateKeyToSigner(privateKeyJwk);
  }

  async verifier() {
    const { publicKeyJwk } = this.toJsonWebKey();
    return publicKeyToVerifier(publicKeyJwk);
  }

  deriveSecret(options: DeriveSecretOptions) {
    const { privateKeyJwk } = this.toJsonWebKey(true);
    let publicKeyJwk;
    if ((options.publicKey as any).publicKeyJwk) {
      publicKeyJwk = (options.publicKey as any).publicKeyJwk;
    } else if ((options.publicKey as any).publicKeyBase58) {
      ({ publicKeyJwk } = toJwkPair(options.publicKey as any));
    } else {
      throw new Error(
        'Cannot deriveSecret from remote... publicKeyJwk or publicKeyBase58 must be present.'
      );
    }
    return deriveSecret(privateKeyJwk, publicKeyJwk);
  }
}
