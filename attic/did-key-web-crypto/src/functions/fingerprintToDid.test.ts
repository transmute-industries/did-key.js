import { fingerprintToDid } from './fingerprintToDid';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance['p-256'].key;
const { controller, id } = example.keypair['application/did+json'];

it('fingerprintToDid', () => {
  const did = fingerprintToDid(id.substring(id.indexOf('#') + 1));
  expect(did).toEqual(controller);
});
