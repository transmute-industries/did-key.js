import fs from 'fs';
import path from 'path';

import { generate } from '../functions/generate';
import { fromJwk } from '../functions/fromJwk';
import { toJwkPair } from '../functions/toJwkPair';

const WRITE_FIXTURE_TO_DISK = false;

it('generate keypair fixture', async () => {
  const k0 = await generate();
  const k1 = await fromJwk(k0.privateKeyJwk);
  const k2: any = await toJwkPair(k1);
  expect(k2.privateKeyJwk).toEqual(k0.privateKeyJwk);

  const fixture = {
    keypair: [
      {
        generate: k0,
        fromJwk: k1,
        toJwkPair: k2,
      },
    ],
  };

  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/keypair.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
