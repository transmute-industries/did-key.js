import { publicKeyToFingerprint } from './publicKeyToFingerprint';

import { keypair, fingerprint } from '../__fixtures__';

it('publicKeyToFingerprint', () => {
  const _fingerprint = publicKeyToFingerprint(keypair[0].publicKeyJwk);
  expect(_fingerprint).toBe(fingerprint[0]);
});
