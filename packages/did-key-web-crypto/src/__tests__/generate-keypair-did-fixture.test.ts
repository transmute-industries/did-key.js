import fs from 'fs';
import path from 'path';
import { SUPPORTED_EC } from '../constants';

import { generate } from '../functions/generate';
import { fromJwk } from '../functions/fromJwk';
import { toJwkPair } from '../functions/toJwkPair';

import { get } from '../driver';

const WRITE_FIXTURE_TO_DISK = false;

const supported = SUPPORTED_EC.map(crvOrSize => {
  let kty = crvOrSize.indexOf('448') === -1 ? 'EC' : 'OKP';
  return { kty, crvOrSize };
});

it('generate did keypair fixture', async () => {
  let fixture: any = {};
  await Promise.all(
    [...supported, ...supported].map(async ({ kty, crvOrSize }) => {
      const k0 = await generate({ kty, crvOrSize });
      const k1 = await fromJwk(k0.privateKeyJwk);
      fixture = {
        ...fixture,
        [k1.controller]: {
          publicKey: await toJwkPair(k1),
          didDocument: await get({
            did: k1.controller,
          }),
        },
      };
      return true;
    })
  );

  // uncomment to debug
  // console.log(JSON.stringify(fixture, null, 2));
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/did-keypair.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
