import crypto from 'crypto';
import * as secp256k1 from '..';

it('has exports', () => {
  expect(secp256k1.generate).toBeDefined();
  expect(secp256k1.resolve).toBeDefined();
});

it('can generate', async () => {
  const res = await secp256k1.generate(
    {
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    },
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
  expect(res.keys).toBeDefined();
});

it('can resolve', async () => {
  const res = await secp256k1.resolve(
    'did:key:zQ3shptjE6JwdkeKN4fcpnYQY3m9Cet3NiHdAfpvSUZBFoKBj',
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
});
