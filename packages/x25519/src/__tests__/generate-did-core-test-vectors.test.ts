import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { X25519KeyPair } from '../X25519KeyPair';
import { resolve } from '../driver';

const WRITE_FIXTURE_TO_DISK = false;

const COUNT = 5;

it('can generate did-core conformance fixture', async () => {
  const fixture: any = [];

  for (let i = 0; i < COUNT; i++) {
    const seed = crypto.randomBytes(32).toString('hex');
    let key = await X25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(seed, 'hex');
      },
    });
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

  // uncomment to debug
  // console.log(JSON.stringify(fixture, null, 2));
  //   expect(fixture).toEqual({ keypair });
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/x25519-did-core-conformance-vectors.json'
      ),
      JSON.stringify(fixture, null, 2)
    );
  }
});
