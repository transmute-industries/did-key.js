import crypto from 'crypto';
import { Ed25519KeyPair } from './Ed25519KeyPair';

import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [example] = didCoreConformance.ed25519.key;

describe('generate', () => {
  it('from random seed', async () => {
    const key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    expect(key.id).toBeDefined();
    expect(key.type).toBe('Ed25519VerificationKey2018');
    expect(key.controller).toBeDefined();
    expect(key.publicKeyBuffer).toBeDefined();
    expect(key.privateKeyBuffer).toBeDefined();
  });

  it('from chosen seed', async () => {
    const key = await Ed25519KeyPair.generate({
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
    let key = await Ed25519KeyPair.from(
      example.keypair['application/did+ld+json']
    );
    expect(key.id).toBe(example.keypair['application/did+json'].id);
  });

  it('from jwk', async () => {
    let key = await Ed25519KeyPair.from(
      example.keypair['application/did+json']
    );
    expect(key.id).toBe(example.keypair['application/did+ld+json'].id);
  });
});

describe('fromFingerprint', () => {
  it('public key from fingerprint', async () => {
    let key = await Ed25519KeyPair.fromFingerprint({
      fingerprint: example.keypair['application/did+ld+json'].id
        .split('#')
        .pop(),
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});

describe('fingerprint', () => {
  it('can calculate fingerprint', async () => {
    let key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});

describe('verifyFingerprint', () => {
  it('can verifyFingerprint', async () => {
    let key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
  });
});

describe('sign / verify', () => {
  it('can sign / verify', async () => {
    let key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    const message = 'hello world';
    const signer = key.signer();
    const signature = await signer.sign({
      data: Buffer.from(message),
    });
    const verifier = key.verifier();
    const _verified = await verifier.verify({
      data: Buffer.from(message),
      signature,
    });
    expect(_verified).toBe(true);
  });
});

describe('toJwk', () => {
  it('can convert to Jwk', async () => {
    let key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _jwk = await key.toJwk();
    expect(_jwk).toEqual({
      ...example.keypair['application/did+json'].publicKeyJwk,
      kid: 'vmzxcDjDU1DgZtNnvm5d2bCMhEcWMzSmfozaA2LpqoQ',
    });
    _jwk = await key.toJwk(true);
    expect(_jwk).toEqual({
      ...example.keypair['application/did+json'].privateKeyJwk,
      kid: 'vmzxcDjDU1DgZtNnvm5d2bCMhEcWMzSmfozaA2LpqoQ',
    });
  });
});

describe('toX25519KeyPair', () => {
  it('can convert to x25519', async () => {
    let key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _key1 = await key.toX25519KeyPair(false);
    expect(_key1.id).toBe('#z6LSoPcAbBJDYwNxKHAtdoG38ZSs1ANe2c8mYk1jeNUzCxWx');
    expect(_key1.privateKeyBuffer).toBeUndefined();
    _key1 = await key.toX25519KeyPair(true);
    expect(_key1.privateKeyBuffer).toBeDefined();
  });
});

describe('toJsonWebKeyPair', () => {
  it('can convert to to json web key 2020', async () => {
    let key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _key1 = await key.toJsonWebKeyPair(true);
    expect(_key1).toEqual(example.keypair['application/did+json']);
  });
});
