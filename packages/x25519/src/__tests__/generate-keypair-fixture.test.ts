import fs from 'fs';
import path from 'path';

import { X25519KeyPair } from '../X25519KeyPair';

import { seed } from '../__fixtures__/seed.json';
import keypairFixture from '../__fixtures__/keypair.json';

const WRITE_FIXTURE_TO_DISK = false;

it('can generate keypair fixture', async () => {
  const fixture: any = {
    keypair: [],
  };
  await Promise.all(
    seed.map(async (s: string) => {
      let key = await X25519KeyPair.generate({
        secureRandom: () => {
          return Buffer.from(s, 'hex');
        },
      });
      fixture.keypair.push({
        seed: s,
        X25519KeyAgreementKey2019: key.toKeyPair(true),
        JsonWebKey2020: await key.toJsonWebKey(true),
      });

      return true;
    })
  );

  // uncomment to debug
  // console.log(JSON.stringify(fixture, null, 2));
  expect(fixture).toEqual(keypairFixture);
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/keypair.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
