import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Secp256k1KeyPair } from '../Secp256k1KeyPair';
import { resolve } from '../driver';
import secp256k1 from 'secp256k1';

const WRITE_FIXTURE_TO_DISK = false;

const COUNT = 5;

const options = {
  secureRandom: () => {
    return crypto.randomBytes(32);
  },
};
const _generate = (secureRandom: any) => {
  let privateKey;
  do {
    privateKey = secureRandom();
  } while (!secp256k1.privateKeyVerify(privateKey));

  const publicKey = secp256k1.publicKeyCreate(privateKey);
  return { publicKey, privateKey };
};

it('can generate did-core conformance fixture', async () => {
  const fixture: any = [];

  for (let i = 0; i < COUNT; i++) {
    const { privateKey } = _generate(options.secureRandom);
    const seed = privateKey.toString('hex');
    let key = await Secp256k1KeyPair.generate({
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
        '../__fixtures__/secp256k1-did-core-conformance-vectors.json'
      ),
      JSON.stringify(fixture, null, 2)
    );
  }
});
