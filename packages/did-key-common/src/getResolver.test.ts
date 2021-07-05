import { getResolver } from './getResolver';

import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';

describe('getResolver', () => {
  it('returns a concrete resolution function for a key pair class', () => {
    const resolve = getResolver(Ed25519KeyPair);
    expect(typeof resolve).toBe('function');
  });
});
