import bs58 from 'bs58';

import * as ed25519 from '@stablelib/ed25519';
import * as keyUtils from './keyUtils';

import * as common from '@transmute/did-key-common';

import { X25519KeyPair } from '@transmute/did-key-x25519';

@common.types.staticImplements<common.types.KeyPairClass>()
export class Ed25519KeyPair {
  public id: string;
  public type: string;
  public controller: string;

  public publicKeyBuffer: Buffer;
  public privateKeyBuffer?: Buffer;

  static fingerprintFromPublicKey(
    keypair: common.types.KeyPairJwk | common.types.KeyPairBase58
  ) {
    let pubkeyBytes: any;

    if ((keypair as any).publicKeyBase58) {
      pubkeyBytes = bs58.decode(
        (keypair as common.types.KeyPairBase58).publicKeyBase58
      );
    }

    if ((keypair as any).publicKeyJwk) {
      pubkeyBytes = bs58.decode(
        keyUtils.publicKeyBase58FromPublicKeyJwk(
          (keypair as common.types.KeyPairJwk).publicKeyJwk
        )
      );
    }
    // ed25519 cryptonyms are multicodec encoded values, specifically:
    // (multicodec ed25519-pub 0xed01 + key bytes)

    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    buffer[0] = 0xed;
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }
  static async generate(options: common.types.KeyPairGenerateOptions) {
    let key;
    if (options.secureRandom) {
      key = ed25519.generateKeyPair({
        isAvailable: true,
        randomBytes: options.secureRandom,
      });
    } else {
      throw new Error('options.secureRandom is required.');
    }

    const publicKeyBase58 = bs58.encode(key.publicKey);
    const privateKeyBase58 = bs58.encode(key.secretKey);

    const did = `did:key:${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    } as any)}`;
    const keyId = `#${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    } as any)}`;
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
      } as any)}`;
      const keyId = `#${Ed25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      } as any)}`;
      return new Ed25519KeyPair({
        id: keyId,
        controller: did,
        publicKeyBase58,
      });
    }

    throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
  }
  // todo: consider moving this type conversion cancer to common.
  static from(options: common.types.KeyPairBase58 | common.types.KeyPairJwk) {
    let privateKeyBase58;
    let publicKeyBase58;

    if ((options as common.types.KeyPairBase58).publicKeyBase58) {
      publicKeyBase58 = (options as common.types.KeyPairBase58).publicKeyBase58;
    }

    if ((options as common.types.KeyPairBase58).privateKeyBase58) {
      privateKeyBase58 = (options as common.types.KeyPairBase58)
        .privateKeyBase58;
    }

    if ((options as common.types.KeyPairJwk).privateKeyJwk) {
      privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyJwk(
        (options as common.types.KeyPairJwk).privateKeyJwk
      );
    }

    if ((options as common.types.KeyPairJwk).publicKeyJwk) {
      publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyJwk(
        (options as common.types.KeyPairJwk).publicKeyJwk
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

    if (options.publicKeyBase58) {
      this.publicKeyBuffer = bs58.decode(options.publicKeyBase58);
    } else if (options.publicKeyJwk) {
      this.publicKeyBuffer = bs58.decode(
        keyUtils.publicKeyBase58FromPublicKeyJwk(options.publicKeyJwk)
      );
    } else {
      throw new Error(
        'Ed25519KeyPair requires publicKeyBase58 or publicKeyJwk, recieved neither.'
      );
    }

    if (options.privateKeyBase58) {
      this.privateKeyBuffer = bs58.decode(options.privateKeyBase58);
    }

    if (this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
  }

  fingerprint() {
    return Ed25519KeyPair.fingerprintFromPublicKey({
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

    // validate the first two multicodec bytes 0xed01
    const valid =
      fingerprintBuffer.slice(0, 2).toString('hex') === 'ed01' &&
      this.publicKeyBuffer.equals(fingerprintBuffer.slice(2));
    if (!valid) {
      return {
        error: new Error('The fingerprint does not match the public key.'),
        valid: false,
      };
    }
    return { valid };
  }

  async toJwk(exportPrivateKey: boolean = false) {
    if (exportPrivateKey) {
      return keyUtils.privateKeyJwkFromPrivateKeyBase58(
        bs58.encode(this.privateKeyBuffer)
      );
    }
    return keyUtils.publicKeyJwkFromPublicKeyBase58(
      bs58.encode(this.publicKeyBuffer)
    );
  }

  toX25519KeyPair(exportPrivateKey: boolean = false) {
    if (exportPrivateKey) {
      return X25519KeyPair.fromEdKeyPair({
        controller: this.controller,
        publicKeyBase58: bs58.encode(this.publicKeyBuffer),
        privateKeyBase58: bs58.encode(this.privateKeyBuffer),
      } as any);
    } else {
      return X25519KeyPair.fromEdKeyPair({
        controller: this.controller,
        publicKeyBase58: bs58.encode(this.publicKeyBuffer),
      } as any);
    }
  }

  toKeyPair(exportPrivateKey: boolean = false) {
    const kp: any = {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    };

    if (exportPrivateKey) {
      kp.privateKeyBase58 = bs58.encode(this.privateKeyBuffer);
    }
    return kp;
  }

  toJsonWebKeyPair(exportPrivateKey: boolean = false) {
    const kp: any = {
      id: this.id,
      type: 'JsonWebKey2020',
      controller: this.controller,
      publicKeyJwk: keyUtils.publicKeyJwkFromPublicKeyBase58(
        bs58.encode(this.publicKeyBuffer)
      ),
    };

    delete kp.publicKeyJwk.kid;
    if (exportPrivateKey) {
      kp.privateKeyJwk = keyUtils.privateKeyJwkFromPrivateKeyBase58(
        bs58.encode(this.privateKeyBuffer)
      );
      delete kp.privateKeyJwk.kid;
    }

    return kp;
  }

  signer() {
    if (!this.privateKeyBuffer) {
      throw new Error('No private key to sign with.');
    }
    let { privateKeyBuffer } = this;
    return {
      async sign({ data }: any) {
        const signatureUInt8Array = ed25519.sign(privateKeyBuffer, data);
        return signatureUInt8Array;
      },
    };
  }
  verifier() {
    if (!this.publicKeyBuffer) {
      throw new Error('No public key to verify with.');
    }
    let { publicKeyBuffer } = this;
    return {
      async verify({ data, signature }: any) {
        let verified = false;
        try {
          verified = ed25519.verify(publicKeyBuffer, data, signature);
        } catch (e) {
          console.error('An error occurred when verifying signature: ', e);
        }
        return verified;
      },
    };
  }
}
