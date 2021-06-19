import crypto from 'crypto';
import bs58 from 'bs58';
import { X25519KeyPair } from './X25519KeyPair';

import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [example, example2] = didCoreConformance.x25519.key;

describe('fingerprintFromPublicKey', () => {
  it('from random seed', async () => {
    let fingerprint = await X25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58:
        example.keypair['application/did+ld+json'].publicKeyBase58,
    } as any);
    expect('#' + fingerprint).toBe(
      example.keypair['application/did+ld+json'].id
    );
  });
});

describe('generate', () => {
  it('from random seed', async () => {
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    expect(key.id).toBeDefined();
  });
  it('from chosen seed', async () => {
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.toKeyPair(true)).toEqual(
      example.keypair['application/did+ld+json']
    );
  });
});
describe('from', () => {
  it('from base58', async () => {
    let key = await X25519KeyPair.from(
      example.keypair['application/did+ld+json']
    );
    expect(key.id).toBe(example.keypair['application/did+ld+json'].id);
  });
  it('from jwk', async () => {
    let key = await X25519KeyPair.from(example.keypair['application/did+json']);
    expect('#' + key.fingerprint()).toBe(
      example.keypair['application/did+json'].id
    );
    expect(key.id).toBe(example.keypair['application/did+ld+json'].id);
  });
});

describe('fromEdKeyPair', () => {
  it('from ed25519', async () => {
    let key = await X25519KeyPair.fromEdKeyPair({
      type: 'Ed25519VerificationKey2018',
      id: '#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
      controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
      publicKeyBase58: 'dbDmZLTWuEYYZNHFLKLoRkEX4sZykkSLNQLXvMUyMB1',
      privateKeyBase58:
        '47QbyJEDqmHTzsdg8xzqXD8gqKuLufYRrKWTmB7eAaWHG2EAsQ2GUyqRqWWYT15dGuag52Sf3j4hs2mu7w52mgps',
    });
    expect(key.toKeyPair(true)).toEqual({
      type: 'X25519KeyAgreementKey2019',
      id: '#z6LScqmY9kirLuY22G6CuqBjuMpoqtgWk7bahWjuxFw5xH6G',
      controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
      publicKeyBase58: '2AbNdSuzFSpGvsiSPBfnamcKzk9Q3WRRpY2EToHZEuKW',
      privateKeyBase58: '96do29HaLryHStVdCD7jB5TdbM1iGwPUDJvnPkfcqhMB',
    });
  });
});

describe('fromFingerprint', () => {
  it('public key from fingerprint', async () => {
    let key = await X25519KeyPair.fromFingerprint({
      fingerprint: example.keypair['application/did+ld+json'].id
        .split('#')
        .pop(),
    });
    expect(key.id).toBe('#' + key.fingerprint());
    expect(key.publicKeyBuffer).toEqual(
      bs58.decode(example.keypair['application/did+ld+json'].publicKeyBase58)
    );
  });
});
describe('fingerprint', () => {
  it('can calculate fingerprint', async () => {
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});
describe('verifyFingerprint', () => {
  it('can verifyFingerprint', async () => {
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
  });
});

describe('toJwk', () => {
  it('can convert to Jwk', async () => {
    let key: any = await X25519KeyPair.generate({
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

describe('deriveSecret', () => {
  it('can convert to hex', async () => {
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    const secret = key.deriveSecret({
      publicKey: example2.keypair['application/did+ld+json'],
    });
    expect(secret).toBeDefined();
  });
});

describe('toJsonWebKeyPair', () => {
  it('can convert to to json web key 2020', async () => {
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(example.seed, 'hex');
      },
    });
    let _key1 = await key.toJsonWebKeyPair(true);

    expect(_key1).toEqual(example.keypair['application/did+json']);
  });
});
