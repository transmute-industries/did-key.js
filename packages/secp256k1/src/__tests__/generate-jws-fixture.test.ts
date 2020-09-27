import fs from 'fs';
import path from 'path';
import { didCoreConformance } from '@transmute/did-key-test-vectors';

import { Jws, types } from '@transmute/did-key-common';

import { Secp256k1KeyPair } from '../Secp256k1KeyPair';

const WRITE_FIXTURE_TO_DISK = false;
let fixtures: any = [];

const keyFixtures = didCoreConformance.secp256k1.key;

const alg: types.ES256K = 'ES256K';

describe(`Signature Support for ${alg}`, () => {
  it(`can sign / verify `, async () => {
    for (let i = 0; i < keyFixtures.length; i++) {
      const fixture = keyFixtures[i];
      const payload = { hello: 'world' };
      const key = await Secp256k1KeyPair.generate({
        secureRandom: () => {
          return Buffer.from(fixture.seed, 'hex');
        },
      });
      const compact = await Jws.createJws(
        {
          sign: (data: any) => {
            const signer = key.signer();
            return signer.sign({ data });
          },
        },
        payload,
        {
          alg,
        }
      );
      const detached = await Jws.createDetachedJws(
        {
          sign: (data: any) => {
            const signer = key.signer();
            return signer.sign({ data });
          },
        },
        Buffer.from(JSON.stringify(payload)),
        {
          alg,
        }
      );

      const verifyCompact = await Jws.verifyJws(
        {
          verify: (message: any, signature: any) => {
            const verifier = key.verifier();
            return verifier.verify({ data: message, signature });
          },
        },
        compact
      );
      expect(verifyCompact).toBe(true);
      const verifyDetached = await Jws.verifyDetachedJws(
        {
          verify: (message: any, signature: any) => {
            const verifier = key.verifier();
            return verifier.verify({ data: message, signature });
          },
        },
        Buffer.from(JSON.stringify(payload)),
        detached
      );
      expect(verifyDetached).toBe(true);
      fixtures.push({
        id: key.controller + key.id,
        payload,
        jws: {
          compact,
          detached,
        },
      });
    }
  });
});

it('can write fixtures to disk', () => {
  //   // uncomment to debug
  // console.log(JSON.stringify(fixtures, null, 2));
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/secp256k1-jws.json'),
      JSON.stringify(fixtures, null, 2)
    );
  }
});
