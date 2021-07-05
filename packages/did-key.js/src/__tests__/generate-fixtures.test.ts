import fs from 'fs-extra';
import path from 'path';

import * as did from '..';

const types = [
  'ed25519',
  'x25519',
  'secp256k1',
  'bls12381',
  'secp256r1',
  'secp384r1',
  'secp521r1',
];

const seeds = [
  '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
  '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c',
  '4093566b154c13ecd5587bc81a02570bf79e5bbdf87b01539325bfdbd7a3820b',
];

describe.skip('fixtures', () => {
  types.forEach((type) => {
    describe(type, () => {
      seeds.forEach((seed) => {
        it(`${seed}`, async () => {
          const caseNumber = seeds.indexOf(seed);
          const genOptions = {
            secureRandom: () => {
              return Buffer.from(seed, 'hex');
            },
          };
          let fixture: any = {
            type,
            caseNumber,
            seed,
          };

          const gen = await did.generate(type, genOptions, {
            accept: 'application/did+json',
          });
          fixture = {
            ...fixture,
            ['application/did+json']: gen,
          };

          const conv = await did.convert(gen.keys, {
            accept: 'application/did+ld+json',
          });
          fixture = {
            ...fixture,
            ['application/did+ld+json']: conv,
          };

          const fixturePath = path.resolve(
            __dirname,
            `../__fixtures__/${type}/did-key-${type}-case-${caseNumber}.json`
          );
          await fs.outputFile(fixturePath, JSON.stringify(fixture, null, 2));
        });
      });
    });
  });
});
