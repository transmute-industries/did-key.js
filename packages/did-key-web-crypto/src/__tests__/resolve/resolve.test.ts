import * as web from '../..';
import { documents } from './__fixtures__';

documents.forEach((document: any) => {
  const { did, ...representations } = document;
  describe(did, () => {
    Object.keys(representations).forEach((representation: any) => {
      it(representation, async () => {
        const res = await web.resolve(did, { accept: representation });
        expect(res.didDocument).toEqual(representations[representation]);
      });
    });
  });
});
    