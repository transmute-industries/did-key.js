import * as mattr from '@mattrglobal/bls12381-key-pair';

import { generateBls12381KeyPair } from '@mattrglobal/bbs-signatures';
import * as bs58 from 'bs58';

export class Bls12381G2KeyPair extends mattr.Bls12381G2KeyPair {
  static async generate(options?: any) {
    const keyPair = generateBls12381KeyPair();
    return Bls12381G2KeyPair.from({
      ...options,
      privateKeyBase58: bs58.encode(keyPair.secretKey as Uint8Array),
      publicKeyBase58: bs58.encode(keyPair.publicKey),
    });
  }

  static toKeyPair(key: any) {
    const fingerprint = Bls12381G2KeyPair.fingerprintFromPublicKey({
      publicKeyBase58: bs58.encode(key.publicKeyBuffer),
    });
    let kp: any = {
      id: '#' + fingerprint,
      type: 'Bls12381G2Key2020',
      controller: `did:key:${fingerprint}`,
      publicKeyBase58: bs58.encode(key.publicKeyBuffer),
    };

    if (key.privateKeyBuffer) {
      kp.privateKeyBase58 = bs58.encode(key.privateKeyBuffer);
    }
    return kp;
  }
}
