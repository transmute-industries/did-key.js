import * as fixtures from './__fixtures__';

import { get } from './driver';

it('resolve a did', async () => {
  let _didDocument: any = await get({
    did: fixtures.didDocument.id,
  });
  expect(_didDocument).toEqual(fixtures.didDocument);
});
