import { getGenerator } from './getGenerator';

import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';

describe('getGenerator', () => {
  it('returns a didDocument and keys', () => {
    const generate = getGenerator(Ed25519KeyPair);
    expect(typeof generate).toBe('function');
  });
});
