import crypto from 'crypto';
import * as secp256k1 from 'bitcoin-ts';
import * as fixtures from '../__fixtures__';

const secureRandom = () => {
  return crypto.randomBytes(32);
};

describe('bitcoin-ts.sanity', () => {
  it('generate', async () => {
    const instance = await secp256k1.instantiateSecp256k1();
    const privateKey = secp256k1.generatePrivateKey(secureRandom);
    expect(privateKey).toBeDefined();
    const publicKey = instance.derivePublicKeyCompressed(privateKey);
    expect(publicKey).toBeDefined();
  });

  it('from seed', async () => {
    const instance = await secp256k1.instantiateSecp256k1();
    const privateKey = secp256k1.generatePrivateKey(() => {
      return Buffer.from(fixtures.seed, 'hex');
    });
    const publicKey = instance.derivePublicKeyCompressed(privateKey);
    expect(Buffer.from(publicKey).toString('hex')).toBe(
      fixtures.secp256k1_key_hex.publicKeyHex
    );
    expect(Buffer.from(privateKey).toString('hex')).toBe(
      fixtures.secp256k1_key_hex.privateKeyHex
    );
  });

  it('sign', async () => {
    const instance = await secp256k1.instantiateSecp256k1();
    const privateKey = secp256k1.generatePrivateKey(() => {
      return Buffer.from(fixtures.seed, 'hex');
    });
    const messageHashUInt8Array = crypto
      .createHash('sha256')
      .update(fixtures.message)
      .digest();
    const _signature = instance.signMessageHashCompact(
      privateKey,
      messageHashUInt8Array
    );
    expect(Buffer.from(_signature).toString('hex')).toBe(fixtures.signature);
  });

  it('verify', async () => {
    const instance = await secp256k1.instantiateSecp256k1();
    const privateKey = secp256k1.generatePrivateKey(() => {
      return Buffer.from(fixtures.seed, 'hex');
    });
    const messageHashUInt8Array = crypto
      .createHash('sha256')
      .update(fixtures.message)
      .digest();
    const publicKey = instance.derivePublicKeyCompressed(privateKey);
    const _verified = await instance.verifySignatureCompact(
      new Uint8Array(Buffer.from(fixtures.signature, 'hex')),
      publicKey,
      messageHashUInt8Array
    );
    expect(_verified).toBe(true);
  });
});
