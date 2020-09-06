import { Crypto } from 'node-webcrypto-ossl';
import * as fixtures from '../__fixtures__';
const crypto = new Crypto();

it('generate & export', async () => {
  let keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
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
    fixtures.keypair_0.publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['verify']
  );
  expect(keyPair.algorithm.name).toBe('ECDSA');
});

it('sign and verify', async () => {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    fixtures.keypair_0.privateKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign']
  );
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    fixtures.keypair_0.publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['verify']
  );

  const signature = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    privateKey,
    Buffer.from(fixtures.message_0)
  );

  let verified = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    publicKey,
    signature,
    Buffer.from(fixtures.message_0)
  );
  expect(verified).toBe(true);
  verified = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    publicKey,
    Buffer.from(fixtures.signature_0, 'base64'),
    Buffer.from(fixtures.message_0)
  );
  expect(verified).toBe(true);
});
