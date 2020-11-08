import { Crypto } from '@peculiar/webcrypto';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;
const { publicKeyJwk, privateKeyJwk } = example.keypair['application/did+json'];

const crypto = new Crypto();
const message = 'hello world';
it('generate & export', async () => {
  let keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );
  expect(keyPair.publicKey).toBeDefined();
  expect(keyPair.privateKey).toBeDefined();
  const exportedPublicKey = await crypto.subtle.exportKey(
    'jwk',
    keyPair.publicKey
  );
  const exportedPrivateKey = await crypto.subtle.exportKey(
    'jwk',
    keyPair.privateKey
  );

  expect(exportedPublicKey).toBeDefined();
  expect(exportedPrivateKey).toBeDefined();
});

it('import', async () => {
  let keyPair = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['verify']
  );
  expect(keyPair.algorithm.name).toBe('ECDSA');
});

it('sign and verify', async () => {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign']
  );
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['verify']
  );

  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    Buffer.from(message)
  );

  let verified = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    publicKey,
    signature,
    Buffer.from(message)
  );
  expect(verified).toBe(true);
  verified = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    publicKey,
    signature,
    Buffer.from(message)
  );
  expect(verified).toBe(true);
});
