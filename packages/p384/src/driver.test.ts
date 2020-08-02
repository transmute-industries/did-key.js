import { P384KeyPair } from './P384KeyPair';
import * as fixtures from './__fixtures__';

import { keyToDidDoc, get } from './driver';

it('convert a p384 key to a did document', async () => {
  const key = await P384KeyPair.from({
    privateKeyJwk: fixtures.privateKeyJwk,
  });
  const _didDocument = keyToDidDoc(key);
  expect(_didDocument).toEqual(fixtures.didDocument);
});

it('resolve a key from id', async () => {
  let _didDocument: any = await get({
    did: fixtures.didDocument.id,
  });
  expect(_didDocument).toEqual(fixtures.didDocument);
});
