import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';
import { X25519KeyPair } from '@transmute/x25519-key-pair';
import { Bls12381KeyPairs } from '@transmute/bls12381-key-pair';
import { Secp256k1KeyPair } from '@transmute/secp256k1-key-pair';
import { KeyPair } from '@transmute/web-crypto-key-pair';

import ed25519Fixture from '../__fixtures__/ed25519.json';
import x25519Fixture from '../__fixtures__/x25519.json';
import bls12381Fixture from '../__fixtures__/bls12381.json';
import secp256k1Fixture from '../__fixtures__/secp256k1.json';
import p256Fixture from '../__fixtures__/p256.json';
import p384Fixture from '../__fixtures__/p384.json';
import p521Fixture from '../__fixtures__/p521.json';

import crypto from 'crypto';

const standardKeyGenOptions = {
  secureRandom: () => {
    return crypto.randomBytes(32);
  },
};

const fixture: any = [
  {
    name: 'ed25519',
    data: ed25519Fixture,
    KeyPair: Ed25519KeyPair,
    keyGenOptions: {
      ...standardKeyGenOptions,
    },
  },
  {
    name: 'x25519',
    data: x25519Fixture,
    KeyPair: X25519KeyPair,
    keyGenOptions: {
      ...standardKeyGenOptions,
    },
  },
  {
    name: 'bls12381',
    data: bls12381Fixture,
    KeyPair: Bls12381KeyPairs,
    keyGenOptions: {
      ...standardKeyGenOptions,
    },
  },
  {
    name: 'secp256k1',
    data: secp256k1Fixture,
    KeyPair: Secp256k1KeyPair,
    keyGenOptions: {
      ...standardKeyGenOptions,
    },
  },
  {
    name: 'p256',
    data: p256Fixture,
    KeyPair: KeyPair,
    keyGenOptions: {
      kty: 'EC',
      crvOrSize: 'P-256',
      ...standardKeyGenOptions,
    },
  },
  {
    name: 'p384',
    data: p384Fixture,
    KeyPair: KeyPair,
    keyGenOptions: {
      kty: 'EC',
      crvOrSize: 'P-384',
      ...standardKeyGenOptions,
    },
  },
  {
    name: 'p521',
    data: p521Fixture,
    KeyPair: KeyPair,
    keyGenOptions: {
      kty: 'EC',
      crvOrSize: 'P-521',
      ...standardKeyGenOptions,
    },
  },
];

export default fixture;
