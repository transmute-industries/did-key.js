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
      fixtures.ed25519.publicKeyHex
    );
    expect(Buffer.from(key.secretKey).toString('hex')).toBe(
      fixtures.ed25519.privateKeyHex
    );
  });

  it('sign', async () => {
    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(fixtures.seed, 'hex');
      },
    });
    const _signarture = ed25519.sign(
      key.secretKey,
      new Uint8Array(Buffer.from(fixtures.message))
    );
    expect(Buffer.from(_signarture).toString('hex')).toBe(fixtures.signature);
  });

  it('verify', async () => {
    const key = ed25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(fixtures.seed, 'hex');
      },
    });
    const _verified = ed25519.verify(
      key.publicKey,
      new Uint8Array(Buffer.from(fixtures.message)),
      new Uint8Array(Buffer.from(fixtures.signature, 'hex'))
    );
    expect(_verified).toBe(true);
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
      fixtures.x25519.publicKeyHex
    );
    const _x25519PrivateKey = ed25519.convertSecretKeyToX25519(key.secretKey);
    expect(Buffer.from(_x25519PrivateKey).toString('hex')).toBe(
      fixtures.x25519.privateKeyHex
    );
  });
});
