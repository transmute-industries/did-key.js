import * as secp256k1 from '../..';
import { documents } from './__fixtures__';

documents.forEach((document: any) => {
  describe(document.seed, () => {
    const { seed, ...representations } = document;
    Object.keys(representations).forEach((representation: any) => {
      describe(representations['application/did+json'].didDocument.id, () => {
        it(representation, async () => {
          const res = await secp256k1.generate(
            {
              secureRandom: () => {
                return Buffer.from(seed, 'hex');
              },
            },
            { accept: representation }
          );
          // console.log(JSON.stringify(res));
          expect(res).toEqual(representations[representation]);
        });
      });
    });
  });
});
