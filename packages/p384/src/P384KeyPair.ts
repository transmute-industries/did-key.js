import base64url from 'base64url';
import * as bs58 from 'bs58';
import * as help from './crypto-helper';

import * as keyUtils from './keyUtils';

export class P384KeyPair {
  public id: string;
  public controller: string;
  public type: string = 'JsonWebKey2020';
  public publicKeyBuffer: Buffer;
  public privateKeyBuffer: Buffer;

  static from = async (options: any) => {
    return new P384KeyPair({ ...options });
  };

  static generate = async () => {
    const key = await help.generate();
    return P384KeyPair.from(key);
  };

  static fingerprintFromPublicKey({ publicKeyBase58 }: any) {
    const pubkeyBytes = bs58.decode(publicKeyBase58);
    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    // See https://github.com/multiformats/multicodec/blob/master/table.csv
    // 0xef is P-384 public key
    buffer[0] = 0xef; //
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }

  static fromFingerprint({ fingerprint }: any) {
    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L77
    if (buffer[0] === 0xef && buffer[1] === 0x01) {
      const publicKeyBase58 = bs58.encode(buffer.slice(2));
      const did = `did:key:${P384KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      const keyId = `#${P384KeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      return new P384KeyPair({
        id: keyId,
        controller: did,
        publicKeyBase58,
      });
    }

    throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
  }

  constructor(options: any) {
    this.id = options.id;
    this.controller = options.controller;
    this.type = options.type || 'JsonWebKey2020';
    this.publicKeyBuffer = options.publicKeyBuffer;
    this.privateKeyBuffer = options.privateKeyBuffer;

    if (options.publicKeyBase58) {
      this.publicKeyBuffer = bs58.decode(options.publicKeyBase58);
    }

    if (options.privateKeyBase58) {
      this.privateKeyBuffer = bs58.decode(options.privateKeyBase58);
    }

    if (options.publicKeyJwk) {
      this.publicKeyBuffer = Buffer.concat([
        base64url.toBuffer(options.publicKeyJwk.x),
        base64url.toBuffer(options.publicKeyJwk.y),
      ]);
    }

    if (options.privateKeyJwk) {
      this.publicKeyBuffer = Buffer.concat([
        base64url.toBuffer(options.privateKeyJwk.x),
        base64url.toBuffer(options.privateKeyJwk.y),
      ]);
      this.privateKeyBuffer = Buffer.concat([
        base64url.toBuffer(options.privateKeyJwk.d),
      ]);
    }

    const publicKeyBase58 = bs58.encode(this.publicKeyBuffer);
    const fingerprint = P384KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    });

    if (!this.id) {
      this.id = '#' + fingerprint;
    }

    if (!this.controller) {
      this.controller = 'did:key:' + fingerprint;
    }
  }

  addEncodedPublicKey(publicKeyNode: any) {
    publicKeyNode.publicKeyBase58 = bs58.encode(this.publicKeyBuffer);
    return publicKeyNode;
  }

  publicNode({ controller = this.controller } = {}) {
    const publicNode: any = {
      id: this.id,
      type: this.type,
    };
    if (controller) {
      publicNode.controller = controller;
    }
    this.addEncodedPublicKey(publicNode); // Subclass-specific
    return publicNode;
  }

  toJwk(exportPrivate: boolean = false) {
    if (exportPrivate) {
      return keyUtils.privateKeyBase58toPrivateKeyJwk(
        bs58.encode(this.privateKeyBuffer),
        bs58.encode(this.publicKeyBuffer)
      );
    }
    return keyUtils.publicKeyBase58toPublicKeyJwk(
      bs58.encode(this.publicKeyBuffer)
    );
  }

  toVerificationMethod() {
    const publicKeyJwk = this.toJwk();
    delete publicKeyJwk.kid;
    return {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyJwk,
    };
  }

  get publicKey() {
    return bs58.encode(this.publicKeyBuffer);
  }

  get privateKey() {
    return bs58.encode(this.privateKeyBuffer);
  }

  fingerprint() {
    const publicKeyBase58 = bs58.encode(this.publicKeyBuffer);
    return P384KeyPair.fingerprintFromPublicKey({ publicKeyBase58 });
  }

  signer() {
    if (!this.privateKeyBuffer) {
      return {
        async sign() {
          throw new Error('No private key to sign with.');
        },
      };
    }
    let privateKeyBase58 = bs58.encode(this.privateKeyBuffer);
    let publicKeyBase58 = bs58.encode(this.publicKeyBuffer);
    let privateKeyJwk = keyUtils.privateKeyBase58toPrivateKeyJwk(
      privateKeyBase58,
      publicKeyBase58
    );
    return {
      async sign({ data }: any) {
        const signature = help.sign(data, privateKeyJwk);
        return signature;
      },
    };
  }

  verifier() {
    if (!this.publicKeyBuffer) {
      return {
        async verify() {
          throw new Error('No public key to verify with.');
        },
      };
    }
    let publicKeyBase58 = bs58.encode(this.publicKeyBuffer);
    let publicKeyJwk = keyUtils.publicKeyBase58toPublicKeyJwk(publicKeyBase58);
    return {
      async verify({ data, signature }: any) {
        return help.verify(data, signature, publicKeyJwk);
      },
    };
  }
}
