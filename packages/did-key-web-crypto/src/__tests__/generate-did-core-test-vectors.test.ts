import fs from 'fs';
import path from 'path';
import { SUPPORTED_EC } from '../constants';

import { KeyPair } from '../KeyPair';
import { resolve } from '../driver';

const WRITE_FIXTURE_TO_DISK = false;

const COUNT = 5;

const supported = SUPPORTED_EC.map((crvOrSize) => {
  let kty = crvOrSize.indexOf('448') === -1 ? 'EC' : 'OKP';
  return { kty, crvOrSize };
});

supported.forEach(({ kty, crvOrSize }) => {
  it(`can generate did-core conformance fixture for ${kty} / ${crvOrSize}`, async () => {
    const fixture: any = [];
    for (let i = 0; i < COUNT; i++) {
      const seed = i;
      let key = await KeyPair.generate({ kty, crvOrSize });
      fixture.push({
        seed,
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
    //   // uncomment to debug
    // console.log(JSON.stringify(fixture, null, 2));
    //   //   expect(fixture).toEqual({ keypair });
    if (WRITE_FIXTURE_TO_DISK) {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../__fixtures__/${crvOrSize}-did-core-conformance-vectors.json`
        ),
        JSON.stringify(fixture, null, 2)
      );
    }
  });
});
