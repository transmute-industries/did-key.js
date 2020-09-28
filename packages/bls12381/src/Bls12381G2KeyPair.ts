import * as mattr from '@mattrglobal/bls12381-key-pair';

import { generateBls12381KeyPair } from '@mattrglobal/bbs-signatures';
import * as bs58 from 'bs58';

export class Bls12381G2KeyPair {
  public id: string;
  public type: string = 'Bls12381G2Key2020';
  public controller: string;
  public publicKeyBuffer: Buffer;
  public privateKeyBuffer?: Buffer;

  static async generate() {
    const keyPair = generateBls12381KeyPair();
    let options = {
      privateKeyBase58: bs58.encode(keyPair.secretKey as Uint8Array),
      publicKeyBase58: bs58.encode(keyPair.publicKey),
    };
    const fingerprint = mattr.Bls12381G2KeyPair.fingerprintFromPublicKey({
      publicKeyBase58: options.publicKeyBase58,
    });
    return new Bls12381G2KeyPair({
      ...options,
      id: '#' + fingerprint,
      controller: `did:key:${fingerprint}`,
    });
  }

  static async fromFingerprint({ fingerprint }: any) {
    const keypair = mattr.Bls12381G2KeyPair.fromFingerprint({
      fingerprint,
    });
    const options = {
      publicKeyBase58: bs58.encode(keypair.publicKeyBuffer),
    };
    return new Bls12381G2KeyPair(options);
  }

  static async from(options: any) {
    let keypair;
    if (options.publicKeyJwk) {
      keypair = await mattr.Bls12381G2KeyPair.fromJwk(options);
    }
    if (options.privateKeyJwk) {
      keypair = await mattr.Bls12381G2KeyPair.fromJwk(options);
    }

    if (options.publicKeyBase58) {
      keypair = await mattr.Bls12381G2KeyPair.from(options);
    }
    if (options.privateKeyBase58) {
      keypair = await mattr.Bls12381G2KeyPair.from(options);
    }

    let _options: any = {
      publicKeyBase58: bs58.encode((keypair as any).publicKeyBuffer),
    };
    if ((keypair as any).privateKeyBuffer) {
      _options.privateKeyBase58 = bs58.encode(
        (keypair as any).privateKeyBuffer
      );
    }

    return new Bls12381G2KeyPair(_options);
  }

  constructor(options: any) {
    this.id = options.id;
    this.type = options.type || 'Bls12381G2Key2020';
    this.controller = options.controller;
    if (options.publicKeyBase58) {
      this.publicKeyBuffer = bs58.decode(options.publicKeyBase58);
    } else if (options.publicKeyJwk) {
      this.publicKeyBuffer = Buffer.from('a');
    } else {
      throw new Error(
        'Bls12381G2KeyPair requires publicKeyBase58 or publicKeyJwk, recieved neither.'
      );
    }
    if (options.privateKeyBase58) {
      this.privateKeyBuffer = bs58.decode(options.privateKeyBase58);
    }

    if (!this.id) {
      this.id = '#' + this.fingerprint();
    }
    if (!this.controller) {
      this.controller = `did:key:${this.fingerprint()}`;
    }
  }
  fingerprint() {
    const fingerprint = mattr.Bls12381G2KeyPair.fingerprintFromPublicKey({
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    });
    return fingerprint;
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

  toJsonWebKeyPair(exportPrivateKey = false) {
    const mattrKey = new mattr.Bls12381G2KeyPair(
      this.toKeyPair(exportPrivateKey)
    );
    const kp: any = {
      id: this.id,
      type: 'JsonWebKey2020',
      controller: this.controller,
      publicKeyJwk: mattrKey.publicKeyJwk,
    };
    delete kp.publicKeyJwk.kid;
    if (exportPrivateKey) {
      kp.privateKeyJwk = mattrKey.privateKeyJwk;
      delete kp.privateKeyJwk.kid;
    }
    return kp;
  }
  verifier() {
    const mattrKey = new mattr.Bls12381G2KeyPair(this.toKeyPair(false));
    return mattrKey.verifier();
  }
  signer() {
    const mattrKey = new mattr.Bls12381G2KeyPair(this.toKeyPair(true));
    return mattrKey.signer();
  }
}
