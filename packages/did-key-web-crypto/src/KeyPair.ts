import bs58 from 'bs58';
import base64url from 'base64url';

import { generate } from './functions/generate';
import { fromJwk } from './functions/fromJwk';

import { deriveSecret } from './Jwe';
import { privateKeyToSigner, publicKeyToVerifier } from './Jws';
import { toJwkPair } from './functions/toJwkPair';
import { fingerprintToDid } from './functions/fingerprintToDid';
import { getJwkTypeFromMultibase } from './functions/getJwkTypeFromMultibase';

import {
  types,
  getEpkGenerator,
  deriveKey,
  KeyEncryptionKey,
} from '@transmute/did-key-cipher';

/* class decorator */
function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    return constructor;
  };
}

const KEY_TYPE = 'JsonWebKey2020';

@staticImplements<types.KeyAgreementKeyPairClass>()
export class KeyPair implements types.KeyAgreementKeyPairInstance {
  public static JWE_ALG: types.ECDH_ES_A256KW = 'ECDH-ES+A256KW';

  static generate = async (options?: any) => {
    const { privateKeyJwk } = await generate(options);
    return new KeyPair({ ...fromJwk(privateKeyJwk) });
  };

  static from = (options?: any) => {
    return new KeyPair({ ...options });
  };

  static fromFingerprint = async ({ fingerprint }: any) => {
    const data = getJwkTypeFromMultibase(fingerprint);
    if (data.kty) {
      const publicKeyBytes = bs58.decode(fingerprint.substring(1));

      const publicKeyBase58 = bs58.encode(publicKeyBytes.slice(3));

      return new KeyPair({
        id: '#' + fingerprint,
        controller: fingerprintToDid(fingerprint),
        type: 'JsonWebKey2020',
        publicKeyBase58,
      });
    }
    throw new Error('Cannot create key from fingerprint ' + fingerprint);
  };

  static fingerprintFromPublicKey(
    keypair: types.KeyPairJwk | types.KeyPairBase58
  ) {
    let kp = KeyPair.from(keypair);
    return kp.id.substring(1);
  }

  static async generateEphemeralKeyPair(
    epkArgs: any
  ): Promise<types.EpkResult> {
    return getEpkGenerator(KeyPair, epkArgs)();
  }

  static async kekFromEphemeralPeer({
    keyAgreementKey,
    epk,
  }: types.KeyEncryptionKeyFromEphemeralPublicKeyOptions) {
    if (!(epk && typeof epk === 'object')) {
      throw new TypeError('"epk" must be an object.');
    }

    // convert to LD key for Web KMS
    const ephemeralPublicKey = new KeyPair({
      publicKeyJwk: epk,
    } as any);

    // safe to use IDs like in rfc7518 or does
    // https://tools.ietf.org/html/rfc7748#section-7 pose any issues?

    // "Party U Info"
    const producerInfo = ephemeralPublicKey.publicKeyBuffer;
    // "Party V Info"
    const consumerInfo = Buffer.from(keyAgreementKey.id);
    // converts keys again....
    // base58 encoding should only be used at the network / serialization boundary.
    const secret = await (keyAgreementKey as types.KeyAgreementKeyPairInstance).deriveSecret(
      {
        publicKey: ephemeralPublicKey.toJsonWebKeyPair(),
      } as any
    );
    const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
    return {
      kek: await KeyEncryptionKey.createKek({ keyData }),
    };
  }

  static async kekFromStaticPeer({
    ephemeralKeyPair,
    staticPublicKey,
  }: types.KeyEncryptionKeyFromStaticPublicKeyOptions) {
    if (staticPublicKey.type !== KEY_TYPE) {
      throw new Error(`"staticPublicKey.type" must be "${KEY_TYPE}".`);
    }

    const epkPair = await KeyPair.from(ephemeralKeyPair.keypair);

    // "Party U Info"
    const producerInfo = epkPair.publicKeyBuffer;
    // "Party V Info"
    const consumerInfo = Buffer.from(staticPublicKey.id);

    const secret = await epkPair.deriveSecret({
      publicKey: staticPublicKey,
    } as any);
    const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
    return {
      kek: await KeyEncryptionKey.createKek({ keyData }),
      epk: ephemeralKeyPair.epk,
      apu: base64url.encode(producerInfo),
      apv: base64url.encode(consumerInfo as any),
    };
  }

  public id: string;
  public type: string;
  public controller: string;
  public publicKeyBuffer: Buffer;
  public privateKeyBuffer?: Buffer;

  constructor(options: any) {
    this.id = options.id;
    this.type = options.type || 'JsonWebKey2020';

    this.controller = options.controller;
    if (options.publicKeyBase58) {
      this.publicKeyBuffer = bs58.decode(options.publicKeyBase58);
    } else if (options.publicKeyJwk) {
      const args = fromJwk(options.publicKeyJwk);
      this.publicKeyBuffer = bs58.decode(args.publicKeyBase58);
      this.id = options.id || args.id;
      this.controller = args.controller;
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

  fingerprint() {
    const { id } = this.toJsonWebKeyPair();
    return id.substring(1);
  }

  toKeyPair(exportPrivateKey = false) {
    let options: any = {
      id: this.id,
      type: 'UnsupportedVerificationMethod2020',
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    };
    if (exportPrivateKey) {
      options.privateKeyBase58 = bs58.encode(this.privateKeyBuffer);
    }
    return options;
  }

  toJsonWebKeyPair(exportPrivateKey = false) {
    const options = this.toKeyPair(exportPrivateKey);
    return toJwkPair(options);
  }

  async signer() {
    const { privateKeyJwk } = this.toJsonWebKeyPair(true);
    return privateKeyToSigner(privateKeyJwk);
  }

  async verifier() {
    const { publicKeyJwk } = this.toJsonWebKeyPair();
    return publicKeyToVerifier(publicKeyJwk);
  }

  deriveSecret(options: types.DeriveSecretOptions) {
    const { privateKeyJwk } = this.toJsonWebKeyPair(true);
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
