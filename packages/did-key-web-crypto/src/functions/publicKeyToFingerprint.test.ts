import { publicKeyToFingerprint } from './publicKeyToFingerprint';

import { keypair_0, fingerprint_0 } from '../__fixtures__';

it('publicKeyToFingerprint', () => {
  const fingerprint = publicKeyToFingerprint(keypair_0.publicKeyJwk);
  expect(fingerprint).toBe(fingerprint_0);
});
