import * as secp256k1 from '../..';
import { documents } from './__fixtures__';

documents.forEach((document: any) => {
  const { did, ...representations } = document;
  describe(did, () => {
    Object.keys(representations).forEach((representation: any) => {
      it(representation, async () => {
        const res = await secp256k1.resolve(did, { accept: representation });
        expect(res.didDocument).toEqual(representations[representation]);
      });
    });
  });
});
