import { fingerprintToDid } from './fingerprintToDid';

import { keypair } from '../__fixtures__';

it('fingerprintToDid', () => {
  const did = fingerprintToDid(
    keypair[0].fromJwk.id.substring(keypair[0].fromJwk.id.indexOf('#') + 1)
  );
  expect(did).toEqual(keypair[0].fromJwk.controller);
});
