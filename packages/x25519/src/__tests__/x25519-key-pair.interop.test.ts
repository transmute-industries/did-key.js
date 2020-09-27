import { didCoreConformance } from '@transmute/did-key-test-vectors';

import { X25519KeyPair } from '../X25519KeyPair';

const db = require('x25519-key-pair');

it('JSON / JSON-LD Interop deriveSecret', async () => {
  const [keyFixture0, keyFixture1] = didCoreConformance.x25519.key;

  const key1 = await db.X25519KeyPair.from(
    keyFixture0.keypair['application/did+ld+json']
  );

  const secret1 = key1.deriveSecret({
    publicKey: keyFixture1.keypair['application/did+ld+json'],
  });

  const key2 = await X25519KeyPair.from(
    keyFixture0.keypair['application/did+json']
  );

  const secret2 = key2.deriveSecret({
    publicKey: keyFixture1.keypair['application/did+json'],
  });

  expect(Buffer.from(secret1).toString('hex')).toBe(
    '2231201529429ce6b1c68a5d42db52f33387a83578871a85e1bcddb40dae1a1a'
  );

  expect(secret1).toEqual(secret2);
});
