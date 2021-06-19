import fs from 'fs';
import path from 'path';

import { Bls12381KeyPairs } from '../Bls12381KeyPairs';
import { resolve } from '../driver';

const count = 5;
const WRITE_FIXTURE_TO_DISK = false;

let fixtures: any = [];
it('generate did-core fixtures', async () => {
  for (let i = 0; i < count; i++) {
    const keypairs = await Bls12381KeyPairs.generate();
    // console.log(keypairs)
    fixtures.push({
      seed: i,
      g1: {
        'application/did+json': await keypairs.g1KeyPair.toJsonWebKeyPair(true),
        'application/did+ld+json': keypairs.g1KeyPair.toKeyPair(true),
      },
      g2: {
        'application/did+json': await keypairs.g2KeyPair.toJsonWebKeyPair(true),
        'application/did+ld+json': keypairs.g2KeyPair.toKeyPair(true),
      },
      resolution: {
        'application/did+json': await resolve(keypairs.controller, {
          accept: 'application/did+json',
        }),
        'application/did+ld+json': await resolve(keypairs.controller, {
          accept: 'application/did+ld+json',
        }),
      },
    });
  }
  //   uncomment to debug
  // console.log(JSON.stringify(fixtures, null, 2));

  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/bls12381_g1andg2.json'),
      JSON.stringify(fixtures, null, 2)
    );
  }
});
