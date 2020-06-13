import bs58 from 'bs58';

import * as ed25519 from '@stablelib/ed25519';
import * as keyUtils from './keyUtils';

import { X25519KeyPair } from 'did-key-x25519';

export class Ed25519KeyPair {
  public id: string;
  public type: string;
  public controller: string;
  public publicKeyBase58: string;
  public privateKeyBase58: string;

  static fingerprintFromPublicKey({ publicKeyBase58 }: any) {
    // ed25519 cryptonyms are multicodec encoded values, specifically:
    // (multicodec ed25519-pub 0xed01 + key bytes)
    const pubkeyBytes = bs58.decode(publicKeyBase58);
    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    buffer[0] = 0xed;
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }
  static async generate(options: any = {}) {
    let key;
    if (options.secureRandom) {
      key = ed25519.generateKeyPair({
        isAvailable: true,
        randomBytes: options.secureRandom,
      });
    }

    if (options.seed) {
      key = ed25519.generateKeyPair({
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

    const did = `did:key:${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    const keyId = `#${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    return new Ed25519KeyPair({
      id: keyId,
      controller: did,
      publicKeyBase58,
      privateKeyBase58,
    });
  }

  static fromFingerprint({ fingerprint }: any) {
    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L81
    if (buffer[0] === 0xed && buffer[1] === 0x01) {
      const publicKeyBase58 = bs58.encode(buffer.slice(2));
      const did = `did:key:${Ed25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      const keyId = `#${Ed25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      return new Ed25519KeyPair({
        id: keyId,
        controller: did,
        publicKeyBase58,
      });
    }

    throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
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

    return new Ed25519KeyPair({
      ...options,
      privateKeyBase58,
      publicKeyBase58,
    });
  }

  constructor(options: any = {}) {
    this.type = 'Ed25519VerificationKey2018';
    this.id = options.id;
    this.controller = options.controller;
    this.publicKeyBase58 = options.publicKeyBase58;
    this.privateKeyBase58 = options.privateKeyBase58;
    if (this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
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
    return Ed25519KeyPair.fingerprintFromPublicKey({ publicKeyBase58 });
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

    // validate the first two multicodec bytes 0xed01
    const valid =
      fingerprintBuffer.slice(0, 2).toString('hex') === 'ed01' &&
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
      return keyUtils.privateKeyJwkFromPrivateKeyBase58(this.privateKeyBase58);
    }
    return keyUtils.publicKeyJwkFromPublicKeyBase58(this.publicKeyBase58);
  }

  async toHex(_private: boolean = false) {
    if (_private) {
      return keyUtils.privateKeyHexFromPrivateKeyBase58(this.privateKeyBase58);
    }
    return keyUtils.publicKeyHexFromPublicKeyBase58(this.publicKeyBase58);
  }

  toX25519KeyPair(_private: boolean = false) {
    const x25519 = X25519KeyPair.fromEdKeyPair({
      controller: this.controller,
      publicKeyBase58: this.publicKeyBase58,
      privateKeyBase58: this.privateKeyBase58,
    });
    if (!_private) {
      delete x25519.privateKeyBase58;
    }
    return x25519;
  }

  signer() {
    if (!this.privateKeyBase58) {
      return {
        async sign() {
          throw new Error('No private key to sign with.');
        },
      };
    }
    let privateKeyBase58 = this.privateKeyBase58;
    return {
      async sign({ data }: any) {
        const signatureUInt8Array = ed25519.sign(
          bs58.decode(privateKeyBase58),
          data
        );
        return signatureUInt8Array;
      },
    };
  }
  verifier() {
    if (!this.publicKeyBase58) {
      return {
        async sign() {
          throw new Error('No public key to verify with.');
        },
      };
    }
    let publicKeyBase58 = this.publicKeyBase58;
    return {
      async verify({ data, signature }: any) {
        let verified = false;
        try {
          verified = ed25519.verify(
            bs58.decode(publicKeyBase58),
            data,
            signature
          );
        } catch (e) {
          console.error('An error occurred when verifying signature: ', e);
        }
        return verified;
      },
    };
  }
}
