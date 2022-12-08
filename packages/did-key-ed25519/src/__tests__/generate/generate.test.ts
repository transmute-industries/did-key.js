import { ResolutionOptions } from '@transmute/did-key-common/dist/types';
import * as ed25519 from '../..';
import { documents } from './__fixtures__';

describe('generate', () => {
  documents.forEach((document: any) => {
    describe(document.seed, () => {
      const { seed, ...representations } = document;
      Object.keys(representations).forEach((representation: any) => {
        describe(representations['application/did+json'].didDocument.id, () => {
          it(representation, async () => {
            const options: ResolutionOptions = {
              accept: representation,
              enableEncryptionKeyDerivation: !!representations[representation]
                .didDocument.keyAgreement,
            };
            const res = await ed25519.generate(
              {
                secureRandom: () => {
                  return Buffer.from(seed, 'hex');
                },
              },
              options
            );
            expect(res).toEqual(representations[representation]);
          });
        });
      });
    });
  });
});
