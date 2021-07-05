import * as bls12381 from '../..';
import { documents } from './__fixtures__';

documents.forEach((document: any) => {
  describe(document.seed, () => {
    const { seed, ...representations } = document;
    Object.keys(representations).forEach((representation: any) => {
      describe(representations['application/did+json'].didDocument.id, () => {
        it(representation, async () => {
          const res = await bls12381.generate(
            {
              secureRandom: () => {
                return Uint8Array.from(Buffer.from(seed, 'hex'));
              },
            },
            { accept: representation }
          );
          expect(res).toEqual(representations[representation]);
        });
      });
    });
  });
});
