import bs58 from 'bs58';
import {
  convertPublicKeyToX25519,
  convertSecretKeyToX25519,
} from '@stablelib/ed25519';
import * as x25519 from '@stablelib/x25519';
import * as keyUtils from './keyUtils';
export class X25519KeyPair {
  public id: string;
  public type: string;
  public controller: string;
  public publicKeyBase58: string;
  public privateKeyBase58: string;

  static fingerprintFromPublicKey({ publicKeyBase58 }: any) {
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L80
    const pubkeyBytes = bs58.decode(publicKeyBase58);
    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    buffer[0] = 0xec;
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }
  static async generate(options: any = {}) {
    let key;
    if (options.secureRandom) {
      key = x25519.generateKeyPair({
        isAvailable: true,
        randomBytes: options.secureRandom,
      });
    }

    if (options.seed) {
      key = x25519.generateKeyPair({
        isAvailable: true,
        randomBytes: () => {
          return Buffer.from(options.seed, 'hex');
        },
      });
    }

    if (!key) {
      throw new Error('options.seed or options.secureRandom is required.');
    }

    const publicKeyBase58 = bs58.encode(key.publicKey);
    const privateKeyBase58 = bs58.encode(key.secretKey);

    const did = `did:key:${X25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    const keyId = `#${X25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    return new X25519KeyPair({
      id: keyId,
      controller: did,
      publicKeyBase58,
      privateKeyBase58,
    });
  }

  static fromFingerprint({ fingerprint }: any) {
    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L80
    if (buffer[0] === 0xec && buffer[1] === 0x01) {
      const publicKeyBase58 = bs58.encode(buffer.slice(2));
      const did = `did:key:${X25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      const keyId = `#${X25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
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

    return X25519KeyPair.from({
      controller: ed25519KeyPair.controller,
      publicKeyBase58,
      privateKeyBase58,
    });
  }

  static async from(options: any) {
    let privateKeyBase58 = options.privateKeyBase58;
    let publicKeyBase58 = options.publicKeyBase58;

    if (options.privateKeyHex) {
      privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyHex(
        options.privateKeyHex
      );
    }

    if (options.publicKeyHex) {
      publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyHex(
        options.publicKeyHex
      );
    }

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
    this.publicKeyBase58 = options.publicKeyBase58;
    this.privateKeyBase58 = options.privateKeyBase58;
    if (!this.id) {
      this.id = `#${this.fingerprint()}`;
    }
  }

  get publicKey() {
    return this.publicKeyBase58;
  }

  get privateKey() {
    return this.privateKeyBase58;
  }
  addEncodedPublicKey(publicKeyNode: any) {
    publicKeyNode.publicKeyBase58 = this.publicKeyBase58;
    return publicKeyNode;
  }

  fingerprint() {
    const { publicKeyBase58 } = this;
    return X25519KeyPair.fingerprintFromPublicKey({ publicKeyBase58 });
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
    let publicKeyBuffer;
    try {
      publicKeyBuffer = bs58.decode(this.publicKeyBase58);
    } catch (e) {
      return { error: e, valid: false };
    }

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

  async toJwk(_private: boolean = false) {
    if (_private) {
      return keyUtils.privateKeyJwkFromPrivateKeyBase58(
        this.publicKeyBase58,
        this.privateKeyBase58
      );
    }
    return keyUtils.publicKeyJwkFromPublicKeyBase58(this.publicKeyBase58);
  }

  async toHex(_private: boolean = false) {
    if (_private) {
      return keyUtils.privateKeyHexFromPrivateKeyBase58(this.privateKeyBase58);
    }
    return keyUtils.publicKeyHexFromPublicKeyBase58(this.publicKeyBase58);
  }

  deriveSecret({ publicKey }: any) {
    const remotePubkeyBytes = bs58.decode(publicKey.publicKeyBase58);
    const privateKeyBytes = bs58.decode(this.privateKeyBase58);

    const scalarMultipleResult = x25519.sharedKey(
      new Uint8Array(privateKeyBytes),
      new Uint8Array(remotePubkeyBytes),
      true
    );

    return scalarMultipleResult;
    // // hashing may be optional here...
    // // https://github.com/digitalbazaar/edv-client/issues/64
    // const key = crypto
    //   .createHash('sha256')
    //   .update(scalarMultipleResult)
    //   .digest();
    // expect(key.toString('hex')).toEqual(fixtures.sharedKey);
  }
}
