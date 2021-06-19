import bs58 from 'bs58';
import * as x25519 from '@stablelib/x25519';
import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [keyFixture0] = didCoreConformance.x25519.key;

it('generate', async () => {
  const key = x25519.generateKeyPair();
  expect(key.publicKey).toBeDefined();
  expect(key.secretKey).toBeDefined();
});

it('from seed', async () => {
  const key = x25519.generateKeyPair({
    isAvailable: true,
    randomBytes: () => {
      return Buffer.from(keyFixture0.seed, 'hex');
    },
  });
  expect(bs58.encode(key.publicKey)).toBe(
    keyFixture0.keypair['application/did+ld+json'].publicKeyBase58
  );
  expect(bs58.encode(key.secretKey)).toBe(
    keyFixture0.keypair['application/did+ld+json'].privateKeyBase58
  );
});

it('sharedKey', async () => {
  const scalarMultipleResult = x25519.sharedKey(
    new Uint8Array(
      bs58.decode(
        keyFixture0.keypair['application/did+ld+json'].privateKeyBase58
      )
    ),
    new Uint8Array(
      bs58.decode(
        keyFixture0.keypair['application/did+ld+json'].publicKeyBase58
      )
    ),
    true
  );

  expect(scalarMultipleResult).toBeDefined();
});
