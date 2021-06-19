import { resolve } from './driver';

const did =
  'did:key:z5TcEvbUQEtPEvzVF9jSGhj9sDbtszgj3KHN2XBBEWuhrzPYDHYcscvg76FGoVqa18LSMB4x5i3nfzMecktKe3k9AdCXmg5ZeTwkBWNfxvFp6ZEdYK2yeu7UFnTvd8sCJ2nYrj55PMSz3HjkyWhdhAc5ej9SA65kgeBLbMNewZPQmmtqKbythaXe5gLTvghjfa8VDZ2H8';

it('get interface defaults to application/did+ld+json', async () => {
  let { didDocument }: any = await resolve(did);
  expect(didDocument.id).toBe(did);
});
