import crypto from 'crypto';

import { Secp256k1KeyPair } from './Secp256k1KeyPair';

import bs58 from 'bs58';
import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [example] = didCoreConformance.secp256k1.key;

describe('generate', () => {
  it('from random seed', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    expect(key.id).toBeDefined();
  });

  it('from chosen seed', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.toJsonWebKeyPair(true)).toEqual(
      example.keypair['application/did+json']
    );
  });
});

describe('from', () => {
  it('from base58', async () => {
    let key = await Secp256k1KeyPair.from(
      example.keypair['application/did+ld+json']
    );
    expect(key.toJsonWebKeyPair(true)).toEqual(
      example.keypair['application/did+json']
    );
  });

  it('from jwk', async () => {
    let key = await Secp256k1KeyPair.from(
      example.keypair['application/did+json']
    );
    expect(key.toJsonWebKeyPair(true)).toEqual(
      example.keypair['application/did+json']
    );
  });
});

describe('fromFingerprint', () => {
  it('public key from fingerprint', async () => {
    let key = await Secp256k1KeyPair.fromFingerprint({
      fingerprint: example.keypair['application/did+ld+json'].id
        .split('#')
        .pop(),
    });
    expect(key.id).toBe('#' + key.fingerprint());
    expect(key.publicKeyBuffer).toBeDefined();
  });
});

describe('fingerprint', () => {
  it('can calculate fingerprint', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});

describe('verifyFingerprint', () => {
  it('can verifyFingerprint', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
  });
});

describe('sign / verify', () => {
  it('can sign / verify', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    const message = Buffer.from('hello');
    const signer = key.signer();
    const signature = await signer.sign({ data: message });
    const verifier = key.verifier();
    const _verified = await verifier.verify({
      data: message,
      signature,
    });
    expect(_verified).toBe(true);
  });
});

describe('toJwk', () => {
  it('can convert to Jwk', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _jwk = await key.toJwk();
    delete _jwk.kid;
    expect(_jwk).toEqual(example.keypair['application/did+json'].publicKeyJwk);

    _jwk = await key.toJwk(true);
    delete _jwk.kid;
    expect(_jwk).toEqual(example.keypair['application/did+json'].privateKeyJwk);
  });
});

describe('toHex', () => {
  it('can convert to hex', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _publicKeyHex = await key.toHex();
    expect(Buffer.from(_publicKeyHex, 'hex')).toEqual(
      bs58.decode(example.keypair['application/did+ld+json'].publicKeyBase58)
    );
    let _privateKeyHex = await key.toHex(true);
    expect(Buffer.from(_privateKeyHex, 'hex')).toEqual(
      bs58.decode(example.keypair['application/did+ld+json'].privateKeyBase58)
    );
  });
});

describe('toJsonWebKeyPair', () => {
  it('can convert to to json web key 2020', async () => {
    let key = await Secp256k1KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _key1 = await key.toJsonWebKeyPair(true);
    expect(_key1).toEqual(example.keypair['application/did+json']);
  });
});
