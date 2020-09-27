import { x25519KeyPair, keyResolver } from '@transmute/did-key-test-vectors';
import { didDocument } from './didDoc.json';

import { seed } from './seed.json';

import minimalCipherFixture from './minimal-cipher-jwe.json';
import didKeyCipherFixture from './did-key-cipher-jwe.json';

const keypair = x25519KeyPair;

export {
  seed,
  keypair,
  didDocument,
  minimalCipherFixture,
  didKeyCipherFixture,
  keyResolver,
};
