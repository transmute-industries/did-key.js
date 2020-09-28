import { getMultibaseFromJwk } from './getMultibaseFromJwk';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;
const { publicKeyJwk, id } = example.keypair['application/did+json'];

it('getMultibaseFromJwk', () => {
  const _fingerprint = getMultibaseFromJwk(publicKeyJwk);
  expect(`#${_fingerprint}`).toBe(id);
});
