import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';

import bs58 from 'bs58';

import * as fixtures from '../__fixtures__';

describe('bls12381.sanity', () => {
  it('generate', async () => {
    const key = await Bls12381G2KeyPair.generate();
    const publicKeyBase58 = bs58.encode(key.publicKeyBuffer);
    const privateKeyBase58 = bs58.encode(key.privateKeyBuffer);
    expect(publicKeyBase58).toBeDefined();
    expect(privateKeyBase58).toBeDefined();
  });

  it('from', async () => {
    const key = await Bls12381G2KeyPair.from(fixtures.bls12381_base58btc);
    expect(key.publicKeyBuffer).toBeDefined();
    expect(key.privateKeyBuffer).toBeDefined();
  });

  it('fromFingerprint', async () => {
    const key = await Bls12381G2KeyPair.fromFingerprint({
      fingerprint: fixtures.bls12381_base58btc.id.split('#').pop(),
    });
    expect('#' + key.fingerprint()).toBe(fixtures.bls12381_base58btc.id);
  });

  it('fingerprintFromPublicKey', async () => {
    const fingerprint = await Bls12381G2KeyPair.fingerprintFromPublicKey({
      publicKeyBase58: fixtures.bls12381_base58btc.publicKeyBase58,
    });
    expect('#' + fingerprint).toBe(fixtures.bls12381_base58btc.id);
  });

  it('sign and verify', async () => {
    const key = await Bls12381G2KeyPair.generate();
    const signer = key.signer();
    const signature = await signer.sign({
      data: fixtures.message,
    });
    const verifier = key.verifier();
    const verified = await verifier.verify({
      data: fixtures.message,
      signature,
    });
    expect(verified).toBe(true);
  });
});
