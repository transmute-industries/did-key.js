import bs58 from 'bs58';
import * as ed25519 from '@stablelib/ed25519';

import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [example] = didCoreConformance.ed25519.key;

const message = 'hello';

describe('ed25519.sanity', () => {
  it('generate', async () => {
    const key = ed25519.generateKeyPair();
    expect(key.publicKey).toBeDefined();
    expect(key.secretKey).toBeDefined();
  });

  it('from seed', async () => {
    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(bs58.encode(key.publicKey)).toBe(
      example.keypair['application/did+ld+json'].publicKeyBase58
    );
    expect(bs58.encode(key.secretKey)).toBe(
      example.keypair['application/did+ld+json'].privateKeyBase58
    );
  });

  it('sign / verify', async () => {
    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    const signature = ed25519.sign(
      key.secretKey,
      new Uint8Array(Buffer.from(message))
    );
    const _verified = ed25519.verify(
      key.publicKey,
      new Uint8Array(Buffer.from(message)),
      signature
    );
    expect(_verified).toBe(true);
  });

  it('to x25519', async () => {
    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    const _x25519PublicKey = ed25519.convertPublicKeyToX25519(key.publicKey);
    expect(Buffer.from(_x25519PublicKey).toString('hex')).toBe(
      'ae0da3648cbfc7a131e4237d0e019be4ce645261de08b392bfa740318391bf6d'
    );
    const _x25519PrivateKey = ed25519.convertSecretKeyToX25519(key.secretKey);
    expect(Buffer.from(_x25519PrivateKey).toString('hex')).toBe(
      'd8fa9ca164ed41c1d0996a12c3e0e9b693632f846322dd9a97134e812835bf56'
    );
  });
});
