import crypto from 'crypto';
import * as x25519 from '..';

it('has exports', () => {
  expect(x25519.generate).toBeDefined();
  expect(x25519.resolve).toBeDefined();
});

it('can generate', async () => {
  const res = await x25519.generate(
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
  const res = await x25519.resolve(
    'did:key:z6LSrdqo4M24WRDJj1h2hXxgtDTyzjjKCiyapYVgrhwZAySn',
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
});
