import crypto from 'crypto';

import { Secp256k1KeyPair } from './Secp256k1KeyPair';
import * as fixtures from './__fixtures__';

describe('generate', () => {
  it('from random seed', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    expect(key.id).toBeDefined();
  });

  it('from chosen seed', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key).toEqual(fixtures.secp256k1_key_base58btc);
  });
});

describe('from', () => {
  it('from base58', async () => {
    let key: any = await Secp256k1KeyPair.from(
      fixtures.secp256k1_key_base58btc
    );
    expect(key.id).toBe(fixtures.secp256k1_key_base58btc.id);
  });

  it('from jwk', async () => {
    let key: any = await Secp256k1KeyPair.from(fixtures.secp256k1_key_jwk);
    expect('#' + key.fingerprint()).toBe(fixtures.secp256k1_key_base58btc.id);
    expect(key.publicKey).toBe(
      fixtures.secp256k1_key_base58btc.publicKeyBase58
    );
  });

  it('from hex', async () => {
    let key: any = await Secp256k1KeyPair.from(fixtures.secp256k1_key_hex);
    expect('#' + key.fingerprint()).toBe(fixtures.secp256k1_key_base58btc.id);
    expect(key.publicKey).toBe(
      fixtures.secp256k1_key_base58btc.publicKeyBase58
    );
  });
});

describe('fromFingerprint', () => {
  it('public key from fingerprint', async () => {
    let key: any = await Secp256k1KeyPair.fromFingerprint({
      fingerprint: fixtures.secp256k1_key_base58btc.id.split('#').pop(),
    });
    expect(key.id).toBe('#' + key.fingerprint());
    expect(key.publicKey).toBe(
      fixtures.secp256k1_key_base58btc.publicKeyBase58
    );
  });
});

describe('fingerprint', () => {
  it('can calculate fingerprint', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});

describe('verifyFingerprint', () => {
  it('can verifyFingerprint', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
  });
});

describe('sign', () => {
  it('can sign', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const signer = key.signer();
    const _signature = await signer.sign({ data: fixtures.message });
    expect(Buffer.from(_signature).toString('hex')).toBe(fixtures.signature);
  });
});

describe('verify', () => {
  it('can verify', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const verifier = key.verifier();
    const _verified = await verifier.verify({
      data: fixtures.message,
      signature: Buffer.from(fixtures.signature, 'hex'),
    });
    expect(_verified).toBe(true);
  });
});

describe('toJwk', () => {
  it('can convert to Jwk', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    let _jwk = await key.toJwk();
    expect(_jwk).toEqual(fixtures.secp256k1_key_jwk.publicKeyJwk);

    _jwk = await key.toJwk(true);
    expect(_jwk).toEqual(fixtures.secp256k1_key_jwk.privateKeyJwk);
  });
});

describe('toHex', () => {
  it('can convert to hex', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    let _publicKeyHex = await key.toHex();
    expect(_publicKeyHex).toBe(fixtures.secp256k1_key_hex.publicKeyHex);
    let _privateKeyHex = await key.toHex(true);
    expect(_privateKeyHex).toBe(fixtures.secp256k1_key_hex.privateKeyHex);
  });
});

describe('toJsonWebKeyPair', () => {
  it('can convert to to json web key 2020', async () => {
    let key: any = await Secp256k1KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    let _key1 = await key.toJsonWebKeyPair(true);

    expect(_key1).toEqual({
      id: '#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
      type: 'JsonWebKey2020',
      controller: 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
      publicKeyJwk: {
        kty: 'EC',
        crv: 'secp256k1',
        x: 'GBMxavme-AfIVDKqI6WBJ4V5wZItsxJ9muhxPByllHQ',
        y: 'SChlfVBhTXG_sRGc9ZdFeCYzI3Kbph3ivE12OFVk4jo',
      },
      privateKeyJwk: {
        kty: 'EC',
        crv: 'secp256k1',
        d: 'm5N7gTItgWz6udWjuqzJsqX-vksUnxJrNjD5OilScBc',
        x: 'GBMxavme-AfIVDKqI6WBJ4V5wZItsxJ9muhxPByllHQ',
        y: 'SChlfVBhTXG_sRGc9ZdFeCYzI3Kbph3ivE12OFVk4jo',
      },
    });
  });
});
