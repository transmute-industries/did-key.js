import { KeyPair } from './KeyPair';
import { keypair } from './__fixtures__';
it('generate', async () => {
  const k0 = await KeyPair.generate();
  expect(k0.publicKeyBuffer).toBeDefined();
  expect(k0.privateKeyBuffer).toBeDefined();
});

it('from / toJsonWebKeyPair', async () => {
  const k0 = await KeyPair.from(keypair[0].fromJwk);
  expect(k0.toJsonWebKeyPair(true)).toEqual(keypair[0].toJwkPair);
});

it('fromFingerprint', async () => {
  const k0 = await KeyPair.fromFingerprint({
    fingerprint: keypair[0].fromJwk.id.split('#').pop(),
  });
  const withoutPrivateKey: any = { ...keypair[0].toJwkPair };
  delete withoutPrivateKey.privateKeyJwk;
  expect(k0.toJsonWebKeyPair()).toEqual(withoutPrivateKey);
});

it('sign / verify', async () => {
  const k0 = await KeyPair.from(keypair[0].fromJwk);
  const signer = await k0.signer();
  const verifier = await k0.verifier();
  const message = Buffer.from('hello');
  const signature = await signer.sign(message);
  const verified = await verifier.verify(message, signature);
  expect(verified).toBe(true);
});

it('deriveSecret', async () => {
  const k0 = await KeyPair.from(keypair[0].fromJwk);
  const secret1 = await k0.deriveSecret({
    publicKey: keypair[0].toJwkPair,
  });
  expect(Buffer.from(secret1).toString('hex')).toBe(
    'd9c7be54ed517b6e8f75c7e7656d12902de066a5e09e1dcbddce682b81b3deb8'
  );

  const secret2 = await k0.deriveSecret({
    publicKey: keypair[0].fromJwk,
  });
  expect(Buffer.from(secret2).toString('hex')).toBe(
    'd9c7be54ed517b6e8f75c7e7656d12902de066a5e09e1dcbddce682b81b3deb8'
  );
});
