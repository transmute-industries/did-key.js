import fs from 'fs';
import path from 'path';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
import { SUPPORTED_EC } from '../constants';

import { Jws } from '@transmute/did-key-common';

import { KeyPair } from '../KeyPair';
import { getJwsHeaderFromJwk } from '../functions/getJwsHeaderFromJwk';

const WRITE_FIXTURE_TO_DISK = false;
let fixtures: any = [];

const supported = SUPPORTED_EC.map((crvOrSize) => {
  let kty = crvOrSize.indexOf('448') === -1 ? 'EC' : 'OKP';
  return { kty, crvOrSize };
});

supported.forEach(({ kty, crvOrSize }) => {
  it(`can generate jws fixture for ${kty} / ${crvOrSize}`, async () => {
    const keyFixtures = didCoreConformance[crvOrSize.toLowerCase()].key;
    for (let i = 0; i < keyFixtures.length; i++) {
      const fixture = keyFixtures[i];
      const payload = { hello: 'world' };
      const key = await KeyPair.from(fixture.keypair['application/did+json']);
      const { alg }: any = getJwsHeaderFromJwk(
        fixture.keypair['application/did+json'].publicKeyJwk
      );
      const signer = await key.signer();
      const verifier = await key.verifier();
      const compact = await Jws.createJws(
        {
          sign: (data: any) => {
            return signer.sign(data);
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
            return signer.sign(data);
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
            return verifier.verify(message, signature);
          },
        },
        compact
      );
      expect(verifyCompact).toBe(true);
      const verifyDetached = await Jws.verifyDetachedJws(
        {
          verify: (message: any, signature: any) => {
            return verifier.verify(message, signature);
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

    // uncomment to debug
    // console.log(JSON.stringify(fixtures, null, 2));
    if (WRITE_FIXTURE_TO_DISK) {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../__fixtures__/${crvOrSize.toLowerCase()}-jws.json`
        ),
        JSON.stringify(fixtures, null, 2)
      );
    }
  });
});
