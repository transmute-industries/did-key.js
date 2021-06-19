import { Bls12381KeyPairs } from './Bls12381KeyPairs';

describe('Bls12381KeyPairs', () => {
  it('generate', async () => {
    const keypairs = await Bls12381KeyPairs.generate();
    expect(keypairs.g1KeyPair).toBeDefined();
    expect(keypairs.g2KeyPair).toBeDefined();
  });

  it('export', async () => {
    const keypairs = await Bls12381KeyPairs.generate();
    const pairs = keypairs.export(true);
    expect(pairs.g1).toBeDefined();
    expect(pairs.g2).toBeDefined();
  });

  it('fromFingerprint', async () => {
    const keypairs = (await Bls12381KeyPairs.fromFingerprint({
      fingerprint:
        'z5TcEur3r2Fe8ketYvNu9Bi1jzVkeSJdMfbyPSzVYjNhfMFUzLYKnApjw9viXv5GD2v7oqGVdohcxducBWQxhNPkG1yGmm69vV4XNThfBNBnqQ4ZXutd3F4zPcxeqsLpgbmuEaDMP5Ak17VPpLcdrSW5PC1FFsAJRjfmSrhwuFxpL7EDj1Mq6cDCPFrLMzF22eGLKdWLX',
    })) as Bls12381KeyPairs;
    expect(keypairs.g1KeyPair.publicKeyBuffer).toBeDefined();
    expect(keypairs.g2KeyPair.publicKeyBuffer).toBeDefined();
    expect(keypairs.g1KeyPair.privateKeyBuffer).not.toBeDefined();
    expect(keypairs.g2KeyPair.privateKeyBuffer).not.toBeDefined();
  });
});
