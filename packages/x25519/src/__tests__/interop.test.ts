import * as fixtures from '../__fixtures__';
const { X25519KeyPair } = require('x25519-key-pair');

describe('interop', () => {
  it('x25519-key-pair deriveSecret', async () => {
    const key = await X25519KeyPair.from(fixtures.x25519_base58btc);
    const secret = key.deriveSecret({
      publicKey: fixtures.x25519_from_ed25519,
    });
    expect(Buffer.from(secret).toString('hex')).toBe(fixtures.derivedSecret);
  });
});
