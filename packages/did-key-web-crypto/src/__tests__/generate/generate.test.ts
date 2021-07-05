import * as web from '../..';
import { documents } from './__fixtures__';

// const fixtures: any = [];
documents.forEach((document: any) => {
  describe(JSON.stringify(document.options), () => {
    const { options } = document;
    it('random key generation', async () => {
      const k = await web.WebCryptoKey.generate(options);
      const r1 = await web.resolve(k.controller, {
        accept: 'application/did+json',
      });
      const r2 = await web.resolve(k.controller, {
        accept: 'application/did+ld+json',
      });
      const k1 = await k.export({
        type: r1.didDocument.verificationMethod[0].type as any,
        privateKey: true,
      });
      const k2 = await k.export({
        type: r2.didDocument.verificationMethod[0].type as any,
        privateKey: true,
      });
      const fixture = {
        did: k.controller,
        'application/did+json': { didDocument: r1.didDocument, keys: [k1] },
        'application/did+ld+json': { didDocument: r2.didDocument, keys: [k2] },
      };
      expect(fixture.did).toEqual(r1.didDocument.id);
      expect(fixture.did).toEqual(r1.didDocument.id);
      // fixtures.push(fixture);
    });
  });
});

// // use to capture fixtures
// it('log', () => {
//   console.log(JSON.stringify(fixtures));
// });
