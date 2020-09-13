import { keypair, did } from './__fixtures__';

import { get } from './driver';

it('resolve a key from id', async () => {
  let _didDocument: any = await get({
    did: keypair[0].toJwkPair.controller,
  });
  expect(_didDocument).toEqual(
    did.didDocument[
      'did:key:zXwpCNGaoAK2oF6cU7WBS2GU2uhKUfca2CCB3LonW2hNYvdqzTFcZc8CtF2HbGGPF9zGdcncQsbFZ2yaNzEvHEkRebyj'
    ]
  );
});
