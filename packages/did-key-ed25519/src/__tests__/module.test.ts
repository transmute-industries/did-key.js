import crypto from 'crypto';
import * as ed25519 from '..';

it('has exports', () => {
  expect(ed25519.generate).toBeDefined();
  expect(ed25519.resolve).toBeDefined();
});

it('can generate', async () => {
  const res = await ed25519.generate(
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
  const res = await ed25519.resolve(
    'did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3',
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
});
