import fs from 'fs';
import path from 'path';

import { keypair, did } from '../__fixtures__';

import { driver } from '../index';

const WRITE_FIXTURE_TO_DISK = false;

it('generate did fixture', async () => {
  const fixture: any = {
    didDocument: {},
  };
  await Promise.all(
    keypair.map(async kp => {
      const didDocument = await driver.get({
        did: kp.toJwkPair.controller,
      });
      fixture.didDocument[kp.toJwkPair.controller] = didDocument;
      return true;
    })
  );
  // uncomment to debug
  //   console.log(JSON.stringify(fixture, null, 2));
  expect(fixture).toEqual(did);
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/did.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
