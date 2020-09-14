import { getMultibaseFromJwk } from './getMultibaseFromJwk';

import { keypair } from '../__fixtures__';

it('getMultibaseFromJwk', () => {
  const _fingerprint = getMultibaseFromJwk(keypair[0].generate.publicKeyJwk);
  expect(`#${_fingerprint}`).toBe(keypair[0].fromJwk.id);
});
