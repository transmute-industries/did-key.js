import bs58 from 'bs58';
import * as base58 from 'base58-universal';

import {
  convertPublicKeyToX25519,
  convertSecretKeyToX25519,
} from '@stablelib/ed25519';
import * as x25519 from '@stablelib/x25519';
import * as keyUtils from './keyUtils';

import base64url from 'base64url-universal';

const KEY_TYPE = 'X25519KeyAgreementKey2019';

import {
  getEpkGenerator,
  deriveKey,
  KeyEncryptionKey,
  ECDH_ES_A256KW,
  KeyAgreementKeyPairClass,
  KeyPair,
  KeyPairBase58,
  KeyPairJwk,
  KeyPairInstance,
  KeyPairGenerateOptions,
} from '@transmute/did-key-cipher';

/* class decorator */
function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

@staticImplements<KeyAgreementKeyPairClass>()
export class X25519KeyPair implements KeyPairInstance {
  public id: string;
  public type: string;
  public controller: string;

  public publicKeyBuffer: Buffer;
  public privateKeyBuffer?: Buffer;

  public static JWE_ALG: ECDH_ES_A256KW = 'ECDH-ES+A256KW';

  static fingerprintFromPublicKey(keypair: KeyPair) {
    let pubkeyBytes: any;

    if ((keypair as any).publicKeyBase58) {
      pubkeyBytes = bs58.decode((keypair as KeyPairBase58).publicKeyBase58);
    }

    if ((keypair as any).publicKeyJwk) {
      pubkeyBytes = bs58.decode(
        keyUtils.publicKeyBase58FromPublicKeyJwk(
          (keypair as KeyPairJwk).publicKeyJwk
        )
      );
    }

    // https://github.com/multiformats/multicodec/blob/master/table.csv#L80

    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    buffer[0] = 0xec;
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }

  static async generate(options: KeyPairGenerateOptions) {
    let key;

    key = x25519.generateKeyPair({
      isAvailable: true,
      randomBytes: options.secureRandom,
    });

    if (!key) {
      throw new Error('options.seed or options.secureRandom is required.');
    }

    const publicKeyBase58 = bs58.encode(key.publicKey);
    const privateKeyBase58 = bs58.encode(key.secretKey);

    const did = `did:key:${X25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    } as any)}`;
    const keyId = `#${X25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    } as any)}`;
    return new X25519KeyPair({
      id: keyId,
      controller: did,
      publicKeyBase58,
      privateKeyBase58,
    });
  }

  static generateEphemeralKeyPair() {
    return getEpkGenerator(X25519KeyPair)();
  }

  static async kekFromEphemeralPeer({ keyAgreementKey, epk }: any) {
    if (!(epk && typeof epk === 'object')) {
      throw new TypeError('"epk" must be an object.');
    }

    // decode public key material
    const publicKey = base64url.decode(epk.x);

    // convert to LD key for Web KMS
    const ephemeralPublicKey = {
      type: KEY_TYPE,
      publicKeyBase58: base58.encode(publicKey),
    };

    // safe to use IDs like in rfc7518 or does
    // https://tools.ietf.org/html/rfc7748#section-7 pose any issues?
    const encoder = new TextEncoder();
    // "Party U Info"
    const producerInfo = publicKey;
    // "Party V Info"
    const consumerInfo = encoder.encode(keyAgreementKey.id);
    const secret = await keyAgreementKey.deriveSecret({
      publicKey: ephemeralPublicKey,
    });
    const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
    return {
      kek: await KeyEncryptionKey.createKek({ keyData }),
    };
  }

  static async kekFromStaticPeer({ ephemeralKeyPair, staticPublicKey }: any) {
    // TODO: consider accepting JWK format for `staticPublicKey` not just LD key
    if (staticPublicKey.type !== KEY_TYPE) {
      throw new Error(`"staticPublicKey.type" must be "${KEY_TYPE}".`);
    }

    const epkPair = await X25519KeyPair.from(ephemeralKeyPair.keypair);
    const encoder = new TextEncoder();
    // "Party U Info"
    const producerInfo = epkPair.publicKeyBuffer;
    // "Party V Info"
    const consumerInfo = encoder.encode(staticPublicKey.id);

    const secret = await epkPair.deriveSecret({ publicKey: staticPublicKey });
    const keyData = await deriveKey({ secret, producerInfo, consumerInfo });
    return {
      kek: await KeyEncryptionKey.createKek({ keyData }),
      epk: ephemeralKeyPair.epk,
      apu: base64url.encode(producerInfo),
      apv: base64url.encode(consumerInfo as any),
      ephemeralPublicKey: ephemeralKeyPair.publicKey,
    };
  }

  static fromFingerprint({ fingerprint }: any) {
    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L80
    if (buffer[0] === 0xec && buffer[1] === 0x01) {
      const publicKeyBase58 = bs58.encode(buffer.slice(2));
      const did = `did:key:${X25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      } as any)}`;
      const keyId = `#${X25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      } as any)}`;
      return new X25519KeyPair({
        id: keyId,
        controller: did,
        publicKeyBase58,
      });
    }

    throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
  }

  static fromEdKeyPair(ed25519KeyPair: any) {
    let publicKeyBase58;
    let privateKeyBase58;

    if (ed25519KeyPair.publicKeyBase58) {
      publicKeyBase58 = bs58.encode(
        convertPublicKeyToX25519(bs58.decode(ed25519KeyPair.publicKeyBase58))
      );
    }

    if (ed25519KeyPair.privateKeyBase58) {
      privateKeyBase58 = bs58.encode(
        convertSecretKeyToX25519(bs58.decode(ed25519KeyPair.privateKeyBase58))
      );
    }

    return new X25519KeyPair({
      controller: ed25519KeyPair.controller,
      publicKeyBase58,
      privateKeyBase58,
    });
  }

  static from(options: any) {
    let privateKeyBase58 = options.privateKeyBase58;
    let publicKeyBase58 = options.publicKeyBase58;

    if (options.privateKeyJwk) {
      privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyJwk(
        options.privateKeyJwk
      );
    }

    if (options.publicKeyJwk) {
      publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyJwk(
        options.publicKeyJwk
      );
    }

    return new X25519KeyPair({
      ...options,
      privateKeyBase58,
      publicKeyBase58,
    });
  }

  constructor(options: any = {}) {
    this.type = 'X25519KeyAgreementKey2019';
    this.id = options.id;
    this.controller = options.controller;

    if (options.publicKeyBase58) {
      this.publicKeyBuffer = Buffer.from(bs58.decode(options.publicKeyBase58));
    } else {
      this.publicKeyBuffer = Buffer.from(bs58.decode(options.publicKeyBase58));
    }

    if (options.privateKeyBase58) {
      this.privateKeyBuffer = Buffer.from(
        bs58.decode(options.privateKeyBase58)
      );
    }

    if (!this.id) {
      this.id = `#${this.fingerprint()}`;
    }
  }

  fingerprint() {
    return X25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    } as any);
  }

  verifyFingerprint(fingerprint: any) {
    // fingerprint should have `z` prefix indicating
    // that it's multi-base encoded
    if (!(typeof fingerprint === 'string' && fingerprint[0] === 'z')) {
      return {
        error: new Error('`fingerprint` must be a multibase encoded string.'),
        valid: false,
      };
    }
    let fingerprintBuffer;
    try {
      fingerprintBuffer = bs58.decode(fingerprint.slice(1));
    } catch (e) {
      return { error: e, valid: false };
    }
    let publicKeyBuffer = this.publicKeyBuffer;

    // validate the first two multicodec bytes 0xec01
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L80
    const valid =
      fingerprintBuffer.slice(0, 2).toString('hex') === 'ec01' &&
      publicKeyBuffer.equals(fingerprintBuffer.slice(2));
    if (!valid) {
      return {
        error: new Error('The fingerprint does not match the public key.'),
        valid: false,
      };
    }
    return { valid };
  }

  toKeyPair(_private: boolean = false) {
    let kp: any = {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    };
    if (_private) {
      kp.privateKeyBase58 = bs58.encode(this.privateKeyBuffer);
    }
    return kp;
  }

  async toJsonWebKey(_private: boolean = false) {
    let kp: any = {
      id: this.id,
      type: 'JsonWebKey2020',
      controller: this.controller,
      publicKeyJwk: await this.toJwk(),
    };
    delete kp.publicKeyJwk.kid;
    if (_private) {
      kp.privateKeyJwk = await this.toJwk(true);
      delete kp.privateKeyJwk.kid;
    }

    return kp;
  }

  async toJwk(_private: boolean = false) {
    const publicKeyBase58 = bs58.encode(this.publicKeyBuffer);
    if (_private) {
      return keyUtils.privateKeyJwkFromPrivateKeyBase58(
        publicKeyBase58,
        bs58.encode(this.privateKeyBuffer)
      );
    }
    return keyUtils.publicKeyJwkFromPublicKeyBase58(publicKeyBase58);
  }

  deriveSecret({ publicKey }: any) {
    const remotePubkeyBytes = bs58.decode(publicKey.publicKeyBase58);
    const privateKeyBytes = this.privateKeyBuffer as Buffer;

    const scalarMultipleResult = x25519.sharedKey(
      new Uint8Array(privateKeyBytes),
      new Uint8Array(remotePubkeyBytes),
      true
    );

    return scalarMultipleResult;
  }
}
