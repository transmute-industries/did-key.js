import { getJwkTypeFromMultibase } from './getJwkTypeFromMultibase';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;
const { id, publicKeyJwk } = example.keypair['application/did+json'];

it('getJwkTypeFromMultibase', () => {
  const data = getJwkTypeFromMultibase(id.substring(id.indexOf('#') + 1));
  expect(data).toEqual({
    kty: publicKeyJwk.kty,
    crv: publicKeyJwk.crv,
  });
});
