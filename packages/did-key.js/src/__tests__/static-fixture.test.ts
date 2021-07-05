import * as did from '..';

import fixtures from '@transmute/did-key-test-vectors';

Object.keys(fixtures).forEach((keyName) => {
  describe(keyName, () => {
    const keyFixture = (fixtures as any)[keyName];
    Object.values(keyFixture).forEach((vector: any) => {
      describe(`Case ${vector.caseNumber} `, () => {
        if (!did.noSupportForSeed.includes(vector.type)) {
          it(`generate 'application/did+json'`, async () => {
            const g1 = await did.generate(
              vector.type,
              {
                secureRandom: () => {
                  return Buffer.from(vector.seed, 'hex');
                },
              },
              {
                accept: 'application/did+json',
              }
            );
            expect(g1).toEqual(vector['application/did+json']);
          });
          it(`generate 'application/did+ld+json'`, async () => {
            const g2 = await did.generate(
              vector.type,
              {
                secureRandom: () => {
                  return Buffer.from(vector.seed, 'hex');
                },
              },
              {
                accept: 'application/did+ld+json',
              }
            );
            expect(g2).toEqual(vector['application/did+ld+json']);
          });
        }
        test(`convert 'application/did+json' -> 'application/did+ld+json'`, async () => {
          const rest = await did.convert(vector['application/did+json'].keys, {
            accept: 'application/did+ld+json',
          });
          expect(rest).toEqual(vector['application/did+ld+json']);
        });
        test(`convert 'application/did+ld+json' -> 'application/did+json'`, async () => {
          const rest = await did.convert(
            vector['application/did+ld+json'].keys,
            {
              accept: 'application/did+json',
            }
          );
          expect(rest).toEqual(vector['application/did+json']);
        });
      });
    });
  });
});
