import { didCoreConformance } from '@transmute/did-key-test-vectors';

import { get, resolve } from './driver';

const [example] = didCoreConformance.ed25519.key;

it('get interface defaults to application/did+ld+json', async () => {
  let _didDocument: any = await get({
    did: example.resolution['application/did+ld+json'].didDocument.id,
  });
  expect(_didDocument).toEqual(
    example.resolution['application/did+ld+json'].didDocument
  );
});

let representations = [
  {
    contentType: 'application/did+json',
  },
  {
    contentType: 'application/did+ld+json',
  },
  {
    contentType: 'application/did+cbor',
  },
];
representations.forEach((rep) => {
  let { id } = example.resolution['application/did+json'].didDocument;
  it(`resolve supports ${rep.contentType}`, async () => {
    let resolutionResponse: any = await resolve(id, {
      accept: rep.contentType,
    });
    if (rep.contentType === 'application/did+cbor'){
      expect(Buffer.isBuffer(resolutionResponse)).toBe(true)
    } else {
      expect(resolutionResponse).toEqual(example.resolution[rep.contentType]);
    }
  });
});
