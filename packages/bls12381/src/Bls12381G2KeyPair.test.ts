import { Bls12381G2KeyPair } from './Bls12381G2KeyPair';

describe('Bls12381G2KeyPair', () => {
  it('generate', async () => {
    const g2KeyPair = await Bls12381G2KeyPair.generate();
    expect(g2KeyPair.publicKeyBuffer).toBeDefined();
    expect(g2KeyPair.privateKeyBuffer).toBeDefined();
  });

  it('fromFingerprint', async () => {
    const g2KeyPair = await Bls12381G2KeyPair.fromFingerprint({
      fingerprint:
        'zUC7D7iwtPodgnN9qTRTdZYNw36RXxhmN4kLDycmmMpFQUfd741qVCz8RcaKBUovZP1soAmw6N76wuAej5ZxgJLXCiUmQXqij3gT59REyF59azhFm6gS6LMoh6N4gUtYNe5KXz6',
    });
    expect(g2KeyPair.publicKeyBuffer).toBeDefined();
    expect(g2KeyPair.privateKeyBuffer).not.toBeDefined();
  });

  it('toKeyPair', async () => {
    const g2KeyPair = await Bls12381G2KeyPair.generate();
    const vm = g2KeyPair.toKeyPair(false);
    expect(vm.publicKeyBase58).toBeDefined();
    expect(vm.privateKeyBase58).not.toBeDefined();
    const kp = g2KeyPair.toKeyPair(true);
    expect(kp.publicKeyBase58).toBeDefined();
    expect(kp.privateKeyBase58).toBeDefined();
  });

  it('toJsonWebKeyPair', async () => {
    const g2KeyPair = await Bls12381G2KeyPair.generate();
    const vm = g2KeyPair.toJsonWebKeyPair(false);
    expect(vm.publicKeyJwk).toBeDefined();
    expect(vm.privateKeyJwk).not.toBeDefined();
    const kp = g2KeyPair.toJsonWebKeyPair(true);
    expect(kp.publicKeyJwk).toBeDefined();
    expect(kp.privateKeyJwk).toBeDefined();
  });

  describe('from', () => {
    it('toJsonWebKeyPair', async () => {
      const g2KeyPair = await Bls12381G2KeyPair.generate();
      const kp = g2KeyPair.toJsonWebKeyPair(true);
      const kp2 = await Bls12381G2KeyPair.from(kp);
      expect(kp2.publicKeyBuffer).toBeDefined();
      expect(kp2.privateKeyBuffer).toBeDefined();
    });

    it('toKeyPair', async () => {
      const g2KeyPair = await Bls12381G2KeyPair.generate();
      const kp = g2KeyPair.toKeyPair(true);
      const kp2 = await Bls12381G2KeyPair.from(kp);
      expect(kp2.publicKeyBuffer).toBeDefined();
      expect(kp2.privateKeyBuffer).toBeDefined();
    });
  });

  it('signer / verifier', async () => {
    const message = 'hello world';
    const g2KeyPair = await Bls12381G2KeyPair.generate();
    const signer = g2KeyPair.signer();
    const verifier = g2KeyPair.verifier();
    const signature = await signer.sign({
      data: new Uint8Array(Buffer.from(message)),
    });
    const verified = await verifier.verify({
      data: new Uint8Array(Buffer.from(message)),
      signature,
    });
    expect(verified).toBe(true);
  });
});
