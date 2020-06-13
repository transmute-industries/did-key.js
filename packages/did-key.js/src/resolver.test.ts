import * as fixtures from './__fixtures__';
import { resolver } from './resolver';

it('resolve ed25519', async () => {
  const didDocument = await resolver.resolve(fixtures.ed25519_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base': 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  });
});

it('resolve secp256k1', async () => {
  const didDocument = await resolver.resolve(fixtures.secp256k1_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base': 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  });
});
