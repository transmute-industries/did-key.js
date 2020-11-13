import bs58 from 'bs58';
// import base64url from 'base64url'
// import * as mattr from '@mattrglobal/bls12381-key-pair'
import { generateKeyPairs } from './functions/generateKeyPairs';
import { keypairsToDidKey } from './functions/keypairsToDidKey';
import { fingerprintToJsonWebKeyPair } from './functions/fingerprintToJsonWebKeyPair';
import { Bls12381G1KeyPair } from './Bls12381G1KeyPair';
import { Bls12381G2KeyPair } from './Bls12381G2KeyPair';

export class Bls12381KeyPairs {
  public id: string;
  public type: string = 'Bls12381KeyPairs2020';
  public controller: string;
  public g1KeyPair: Bls12381G1KeyPair;
  public g2KeyPair: Bls12381G2KeyPair;

  static async generate() {
    const { bls12381G1KeyPair, bls12381G2KeyPair } = await generateKeyPairs();
    const options = {
      id: '',
      controller: '',
      g1KeyPair: new Bls12381G1KeyPair({
        id: bls12381G2KeyPair.id,
        // controller: bls12381G2KeyPair.controller,
        publicKeyBuffer: bs58.decode(bls12381G1KeyPair.publicKeyBase58),
        privateKeyBuffer: bs58.decode(bls12381G1KeyPair.privateKeyBase58),
      }),
      g2KeyPair: new Bls12381G2KeyPair({
        id: bls12381G2KeyPair.id,
        // controller: bls12381G2KeyPair.controller,
        publicKeyBuffer: bs58.decode(bls12381G2KeyPair.publicKeyBase58),
        privateKeyBuffer: bs58.decode(bls12381G2KeyPair.privateKeyBase58),
      }),
    };
    const did = keypairsToDidKey(
      options.g1KeyPair.toJsonWebKeyPair(false),
      options.g2KeyPair.toJsonWebKeyPair(false)
    );
    options.g1KeyPair.controller = did;
    options.g2KeyPair.controller = did;
    options.controller = did;
    options.id = '#' + did.split('did:key:').pop();

    return new Bls12381KeyPairs(options);
  }

  static async fromFingerprint({ fingerprint }: any) {
    if (fingerprint.indexOf('z5T') === 0) {
      const {
        bls12381G1KeyPair,
        bls12381G2KeyPair,
      } = fingerprintToJsonWebKeyPair(fingerprint);
      delete bls12381G1KeyPair.id;
      delete bls12381G2KeyPair.id;
      const controller = 'did:key:' + fingerprint;
      bls12381G1KeyPair.controller = controller;
      bls12381G2KeyPair.controller = controller;
      return new Bls12381KeyPairs({
        id: '#' + fingerprint,
        controller,
        g1KeyPair: await Bls12381G1KeyPair.from(bls12381G1KeyPair),
        g2KeyPair: await Bls12381G2KeyPair.from(bls12381G2KeyPair),
      });
    }
    if (fingerprint.indexOf('z3t') === 0) {
      return Bls12381G1KeyPair.fromFingerprint({ fingerprint });
    }
    if (fingerprint.indexOf('zUC') === 0) {
      return Bls12381G2KeyPair.fromFingerprint({ fingerprint });
    }
    throw new Error(
      'Bls12381KeyPairs only supports g1, g2 and g1 and g2 mulicodec fingerprints.'
    );
  }

  constructor(options: any) {
    this.id = options.id;
    this.controller = options.controller;
    this.g1KeyPair = options.g1KeyPair;
    this.g2KeyPair = options.g2KeyPair;
  }

  fingerprint() {
    const did = keypairsToDidKey(
      this.g1KeyPair.toJsonWebKeyPair(false),
      this.g2KeyPair.toJsonWebKeyPair(false)
    );
    return did.split('did:key:').pop();
  }

  export(exportPrivate = false) {
    return {
      fingerprint: this.fingerprint(),
      g1: this.g1KeyPair.toJsonWebKeyPair(exportPrivate),
      g2: this.g2KeyPair.toJsonWebKeyPair(exportPrivate),
    };
  }
}
