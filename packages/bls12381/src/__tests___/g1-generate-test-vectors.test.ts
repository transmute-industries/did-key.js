import fs from 'fs';
import path from 'path';

import { Bls12381G1KeyPair } from '../Bls12381G1KeyPair';
import { resolve } from '../driver';

const count = 5;
const WRITE_FIXTURE_TO_DISK = false;

let fixtures: any = [];
it('generate did-core fixtures', async () => {
  for (let i = 0; i < count; i++) {
    const key = await Bls12381G1KeyPair.generate();
    fixtures.push({
      seed: i,
      keypair: {
        'application/did+json': await key.toJsonWebKeyPair(true),
        'application/did+ld+json': key.toKeyPair(true),
      },
      resolution: {
        'application/did+json': await resolve(key.controller, {
          accept: 'application/did+json',
        }),
        'application/did+ld+json': await resolve(key.controller, {
          accept: 'application/did+ld+json',
        }),
      },
    });
  }
  //   uncomment to debug
  // console.log(JSON.stringify(fixtures, null, 2));

  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/bls12381_g1.json'),
      JSON.stringify(fixtures, null, 2)
    );
  }
});

