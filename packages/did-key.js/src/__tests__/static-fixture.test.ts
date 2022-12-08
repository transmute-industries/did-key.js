import * as did from '..';

import fixtures from '@transmute/did-key-test-vectors';

describe('static-fixtures', () => {
  Object.keys(fixtures).forEach((keyName) => {
    describe(keyName, () => {
      const keyFixture = (fixtures as any)[keyName];
      Object.values(keyFixture).forEach((vector: any) => {
        describe(`Case ${vector.caseNumber} `, () => {
          if (!did.noSupportForSeed.includes(vector.type)) {
            it(`generate 'application/did+json'`, async () => {
              const didDocumentRepresentation: 'application/did+json' =
                'application/did+json';
              const options = {
                accept: didDocumentRepresentation,
                enableEncryptionKeyDerivation: !!vector[
                  didDocumentRepresentation
                ].didDocument.keyAgreement,
              };
              const g1 = await did.generate(
                vector.type,
                {
                  secureRandom: () => {
                    return Buffer.from(vector.seed, 'hex');
                  },
                },
                options
              );
              expect(g1).toEqual(vector[didDocumentRepresentation]);
            });
            it(`generate 'application/did+ld+json'`, async () => {
              const didDocumentRepresentation: 'application/did+ld+json' =
                'application/did+ld+json';
              const options = {
                accept: didDocumentRepresentation,
                enableEncryptionKeyDerivation: !!vector[
                  didDocumentRepresentation
                ].didDocument.keyAgreement,
              };
              const g2 = await did.generate(
                vector.type,
                {
                  secureRandom: () => {
                    return Buffer.from(vector.seed, 'hex');
                  },
                },
                options
              );
              expect(g2).toEqual(vector[didDocumentRepresentation]);
            });
          }
          test(`convert 'application/did+json' -> 'application/did+ld+json'`, async () => {
            const didDocumentRepresentation: 'application/did+ld+json' =
              'application/did+ld+json';
            const options = {
              accept: didDocumentRepresentation,
              enableEncryptionKeyDerivation: !!vector[didDocumentRepresentation]
                .didDocument.keyAgreement,
            };
            const rest = await did.convert(
              vector['application/did+json'].keys,
              options
            );
            expect(rest).toEqual(vector[didDocumentRepresentation]);
          });
          test(`convert 'application/did+ld+json' -> 'application/did+json'`, async () => {
            const didDocumentRepresentation: 'application/did+json' =
              'application/did+json';
            const options = {
              accept: didDocumentRepresentation,
              enableEncryptionKeyDerivation: !!vector[didDocumentRepresentation]
                .didDocument.keyAgreement,
            };
            const rest = await did.convert(
              vector['application/did+ld+json'].keys,
              options
            );
            expect(rest).toEqual(vector[didDocumentRepresentation]);
          });
        });
      });
    });
  });
});
