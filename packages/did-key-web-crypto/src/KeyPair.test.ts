import { KeyPair } from './KeyPair';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;

it('generate', async () => {
  const k0 = await KeyPair.generate();
  expect(k0.publicKeyBuffer).toBeDefined();
  expect(k0.privateKeyBuffer).toBeDefined();
});

it('from / toJsonWebKeyPair', async () => {
  const k0 = await KeyPair.from(example.keypair['application/did+json']);
  expect(k0.toJsonWebKeyPair(true)).toEqual(
    example.keypair['application/did+json']
  );
});

it('fromFingerprint', async () => {
  const k0 = await KeyPair.fromFingerprint({
    fingerprint: example.keypair['application/did+json'].id.split('#').pop(),
  });
  const withoutPrivateKey: any = { ...example.keypair['application/did+json'] };
  delete withoutPrivateKey.privateKeyJwk;
  expect(k0.toJsonWebKeyPair()).toEqual(withoutPrivateKey);
});

it('sign / verify', async () => {
  const k0 = await KeyPair.from(example.keypair['application/did+json']);
  const signer = await k0.signer();
  const verifier = await k0.verifier();
  const message = Buffer.from('hello');
  const signature = await signer.sign(message);
  const verified = await verifier.verify(message, signature);
  expect(verified).toBe(true);
});

it('deriveSecret', async () => {
  const k0 = await KeyPair.from(example.keypair['application/did+ld+json']);
  const secret1 = await k0.deriveSecret({
    publicKey: example.keypair['application/did+json'],
  });
  const secret2 = await k0.deriveSecret({
    publicKey: example.keypair['application/did+ld+json'],
  });
  expect(secret2).toEqual(secret1);
});
