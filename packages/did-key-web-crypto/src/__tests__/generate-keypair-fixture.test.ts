import fs from 'fs';
import path from 'path';
import { SUPPORTED_EC } from '../constants';

import { generate } from '../functions/generate';
import { fromJwk } from '../functions/fromJwk';
import { toJwkPair } from '../functions/toJwkPair';

const WRITE_FIXTURE_TO_DISK = false;

const supported = SUPPORTED_EC.map(crvOrSize => {
  let kty = crvOrSize.indexOf('448') == -1 ? 'EC' : 'OKP';
  return { kty, crvOrSize };
});

it('generate keypair fixture', async () => {
  const fixture: any = {
    keypair: [],
  };
  await Promise.all(
    supported.map(async ({ kty, crvOrSize }) => {
      const k0 = await generate({ kty, crvOrSize });
      const k1 = await fromJwk(k0.privateKeyJwk);
      const k2: any = await toJwkPair(k1);
      expect(k2.privateKeyJwk).toEqual(k0.privateKeyJwk);

      fixture.keypair.push({
        generate: k0,
        fromJwk: k1,
        toJwkPair: k2,
      });
      return true;
    })
  );

  // uncomment to debug
  // console.log(JSON.stringify(fixture, null, 2));
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/keypair.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
