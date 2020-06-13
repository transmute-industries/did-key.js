import * as ed25519 from '@stablelib/ed25519';
import * as fixtures from '../__fixtures__';

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
        return Buffer.from(fixtures.seed, 'hex');
      },
    });
    expect(Buffer.from(key.publicKey).toString('hex')).toBe(
      fixtures.ed25519_1.publicKeyHex
    );
    expect(Buffer.from(key.secretKey).toString('hex')).toBe(
      fixtures.ed25519_1.privateKeyHex
    );
  });

  it('to x25519', async () => {
    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(fixtures.seed, 'hex');
      },
    });
    const _x25519PublicKey = ed25519.convertPublicKeyToX25519(key.publicKey);
    expect(Buffer.from(_x25519PublicKey).toString('hex')).toBe(
      fixtures.x25519_1.publicKeyHex
    );
    const _x25519PrivateKey = ed25519.convertSecretKeyToX25519(key.secretKey);
    expect(Buffer.from(_x25519PrivateKey).toString('hex')).toBe(
      fixtures.x25519_1.privateKeyHex
    );
  });
});
