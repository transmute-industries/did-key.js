import { ResolutionOptions } from '@transmute/did-key-common/dist/types';

import * as ed25519 from '../..';
import { documents } from './__fixtures__';

describe('resolve', () => {
  documents.forEach((document: any) => {
    const { did, ...representations } = document;
    describe(did, () => {
      Object.keys(representations).forEach((representation: any) => {
        it(representation, async () => {
          const options: ResolutionOptions  = {
            accept: representation,
            enableEncryptionKeyDerivation: !!representations[representation]
              .keyAgreement,
          };
          const res = await ed25519.resolve(did, options);
          expect(res.didDocument).toEqual(representations[representation]);
        });
      });
    });
  });
});
