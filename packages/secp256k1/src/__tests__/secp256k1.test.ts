import crypto from 'crypto';
import secp256k1 from 'secp256k1';

import * as fixtures from '../__fixtures__';

const _secureRandom = () => {
  return crypto.randomBytes(32);
};

const generate = (secureRandom: any) => {
  let privateKey;
  do {
    privateKey = secureRandom();
  } while (!secp256k1.privateKeyVerify(privateKey));

  const publicKey = secp256k1.publicKeyCreate(privateKey);
  return { publicKey, privateKey };
};

describe('secp256k1.sanity', () => {
  it('generate', async () => {
    const key = generate(_secureRandom);
    expect(key.publicKey).toBeDefined();
    expect(key.privateKey).toBeDefined();
  });

  it('from seed', async () => {
    const key = generate(() => {
      return Buffer.from(fixtures.seed, 'hex');
    });
    expect(Buffer.from(key.publicKey).toString('hex')).toBe(
      fixtures.secp256k1_key_hex.publicKeyHex
    );
    expect(Buffer.from(key.privateKey).toString('hex')).toBe(
      fixtures.secp256k1_key_hex.privateKeyHex
    );
    // console.log();
  });

  it('sign', async () => {
    const key = generate(() => {
      return Buffer.from(fixtures.seed, 'hex');
    });
    const msg = crypto
      .createHash('sha256')
      .update(fixtures.message)
      .digest();
    const sigObj: any = secp256k1.ecdsaSign(msg, key.privateKey);
    expect(Buffer.from(sigObj.signature).toString('hex')).toBe(
      fixtures.signature
    );
  });

  it('verify', async () => {
    const key = generate(() => {
      return Buffer.from(fixtures.seed, 'hex');
    });
    const msg = crypto
      .createHash('sha256')
      .update(fixtures.message)
      .digest();
    const _verified = secp256k1.ecdsaVerify(
      Buffer.from(fixtures.signature, 'hex'),
      msg,
      key.publicKey
    );
    expect(_verified).toBe(true);
  });
});
