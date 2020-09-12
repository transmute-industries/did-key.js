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
    fixtures.keypair[0].generate.publicKeyJwk,
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
    fixtures.keypair[0].generate.privateKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign']
  );
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    fixtures.keypair[0].generate.publicKeyJwk,
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
    Buffer.from(fixtures.message[0])
  );

  let verified = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    publicKey,
    signature,
    Buffer.from(fixtures.message[0])
  );
  expect(verified).toBe(true);
  verified = await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-384' },
    },
    publicKey,
    signature,
    Buffer.from(fixtures.message[0])
  );
  expect(verified).toBe(true);
});

it('public from private', async () => {
  // export to jwk
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    fixtures.keypair[0].generate.privateKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign']
  );
  const exportedPrivateKey = await crypto.subtle.exportKey('jwk', privateKey);
  // delete jwk private key props
  delete exportedPrivateKey.d;
  delete exportedPrivateKey.key_ops;
  delete exportedPrivateKey.ext;

  // import key
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    exportedPrivateKey,
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['verify']
  );
  expect(publicKey.type).toBe('public');
});
