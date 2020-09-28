import { didCoreConformance } from '@transmute/did-key-test-vectors';

import { get, resolve } from './driver';

const [example] = didCoreConformance.bls12381_g2.key;

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
    keyType: 'JsonWebKey2020',
    contentType: 'application/did+json',
  },
  {
    keyType: 'Bls12381G2Key2020',
    contentType: 'application/did+ld+json',
  },
];
representations.forEach(rep => {
  let { id } = example.resolution[rep.contentType].didDocument;
  it(`resolve supports ${rep.contentType}`, async () => {
    let resolutionResponse: any = await resolve(id, {
      accept: rep.contentType,
    });
    expect(resolutionResponse).toEqual(example.resolution[rep.contentType]);
  });
});
