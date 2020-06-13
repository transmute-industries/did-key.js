import crypto from 'crypto';
import * as x25519 from '@stablelib/x25519';
import * as fixtures from '../__fixtures__';

describe('x25519.sanity', () => {
  it('generate', async () => {
    const key = x25519.generateKeyPair();
    expect(key.publicKey).toBeDefined();
    expect(key.secretKey).toBeDefined();
  });

  it('from seed', async () => {
    const key = x25519.generateKeyPair({
      isAvailable: true,
      randomBytes: () => {
        return Buffer.from(fixtures.seed, 'hex');
      },
    });
    expect(Buffer.from(key.publicKey).toString('hex')).toBe(
      fixtures.x25519.publicKeyHex
    );
    expect(Buffer.from(key.secretKey).toString('hex')).toBe(
      fixtures.x25519.privateKeyHex
    );
  });

  it('sharedKey', async () => {
    const scalarMultipleResult = x25519.sharedKey(
      new Uint8Array(Buffer.from(fixtures.x25519.privateKeyHex, 'hex')),
      new Uint8Array(Buffer.from(fixtures.x25519_1.publicKeyHex, 'hex')),
      true
    );
    // hashing may be optional here...
    // https://github.com/digitalbazaar/edv-client/issues/64
    const key = crypto
      .createHash('sha256')
      .update(scalarMultipleResult)
      .digest();
    expect(key.toString('hex')).toEqual(fixtures.sharedKey);
  });
});
