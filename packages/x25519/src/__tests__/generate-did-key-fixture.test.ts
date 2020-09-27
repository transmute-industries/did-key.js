import fs from 'fs';
import path from 'path';

import { keypair } from '../__fixtures__';
import didDocFixture from '../__fixtures__/didDoc.json';

import { X25519KeyPair } from '../X25519KeyPair';
import { get, keyToDidDoc } from '../driver';

const WRITE_FIXTURE_TO_DISK = false;

it('can generate did key fixture', async () => {
  const fixture: any = {
    didDocument: {},
  };
  await Promise.all(
    keypair.map(async (kp: any) => {
      const k = X25519KeyPair.from(kp.X25519KeyAgreementKey2019);
      const didDoc = keyToDidDoc(k);
      const resolved = await get({ did: didDoc.id });
      expect(resolved).toEqual(didDoc);
      expect(resolved.id).toBe(k.controller);
      fixture.didDocument = {
        ...fixture.didDocument,
        [resolved.id]: resolved,
      };
    })
  );
  // uncomment to debug
  //   console.log(JSON.stringify(fixture, null, 2));
  expect(fixture).toEqual(didDocFixture);
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/didDoc.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
