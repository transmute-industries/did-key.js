import * as web from '..';

it('has exports', () => {
  expect(web.generate).toBeDefined();
  expect(web.resolve).toBeDefined();
});

it('can generate', async () => {
  const res = await web.generate(
    {
      kty: 'EC',
      crvOrSize: 'P-384',
    },
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
  expect(res.keys).toBeDefined();
});

it('can resolve', async () => {
  const res = await web.resolve(
    'did:key:z82Lm1MpAkeJcix9K8TMiLd5NMAhnwkjjCBeWHXyu3U4oT2MVJJKXkcVBgjGhnLBn2Kaau9',
    { accept: 'application/did+json' }
  );
  expect(res.didDocument).toBeDefined();
});
