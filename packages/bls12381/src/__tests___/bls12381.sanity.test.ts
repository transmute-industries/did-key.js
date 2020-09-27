import { Bls12381G2KeyPair } from '@mattrglobal/bls12381-key-pair';

import bs58 from 'bs58';

import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [example] = didCoreConformance.bls12381_g2.key;

const message = 'hello world';

describe('bls12381.sanity', () => {
  it('generate', async () => {
    const key = await Bls12381G2KeyPair.generate();
    const publicKeyBase58 = bs58.encode(key.publicKeyBuffer);
    const privateKeyBase58 = bs58.encode(key.privateKeyBuffer);
    expect(publicKeyBase58).toBeDefined();
    expect(privateKeyBase58).toBeDefined();
  });

  it('from', async () => {
    const key = await Bls12381G2KeyPair.from(
      example.keypair['application/did+ld+json']
    );
    expect(key.publicKeyBuffer).toBeDefined();
    expect(key.privateKeyBuffer).toBeDefined();
  });

  it('fromFingerprint', async () => {
    const key = await Bls12381G2KeyPair.fromFingerprint({
      fingerprint: example.keypair['application/did+ld+json'].id
        .split('#')
        .pop(),
    });
    expect('#' + key.fingerprint()).toBe(
      example.keypair['application/did+ld+json'].id
    );
  });

  it('fingerprintFromPublicKey', async () => {
    const fingerprint = await Bls12381G2KeyPair.fingerprintFromPublicKey({
      publicKeyBase58:
        example.keypair['application/did+ld+json'].publicKeyBase58,
    });
    expect('#' + fingerprint).toBe(
      example.keypair['application/did+ld+json'].id
    );
  });

  it('sign and verify', async () => {
    const key = await Bls12381G2KeyPair.generate();
    const signer = key.signer();
    const signature = await signer.sign({
      data: new Uint8Array(Buffer.from(message)),
    });
    const verifier = key.verifier();
    const verified = await verifier.verify({
      data: new Uint8Array(Buffer.from(message)),
      signature,
    });
    expect(verified).toBe(true);
  });
});
