import * as fixtures from './__fixtures__';
import { resolver } from './resolver';

it('resolve ed25519', async () => {
  const didDocument = await resolver.resolve(fixtures.ed25519_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base': 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
  });
});

it('resolve x25519', async () => {
  const didDocument = await resolver.resolve(fixtures.x25519_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base': 'did:key:z6LSnjagzhe8Df6gZmroW3wjDd7XQLwAuYfwa4ZeTBCGFoYc',
  });
});

it('resolve bls12381', async () => {
  const didDocument = await resolver.resolve(fixtures.bls12381_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base':
      'did:key:zUC74d2aVbyZkgWtxoW91p6vhDA4ck3EtWgt1wDK86QGDZWBBB24kCVb7kChBfk6W2uFfbjuRQVaH4VBCz8a2xMXSMy4cWnBgqo19ZBCeqdwrk5Wfi41fxjiB73khmxoDUmXrsm',
  });
});

it('resolve secp256k1', async () => {
  const didDocument = await resolver.resolve(fixtures.secp256k1_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base': 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  });
});

it('resolve p384', async () => {
  const didDocument = await resolver.resolve(fixtures.p384_did);
  expect(didDocument['@context'][1]).toEqual({
    '@base':
      'did:key:zUewNx6pAKABMemqTqcEWAEPVxht1ktr9ugLyXkoHiSAzhQBDNRdC2nLauoLKcwstytQCYeCazJ8m4rowp27ivJS4NmofDMAMjLqbqcn1tVKQTAk45d7wzcJZwJaZaAkSu78wFK',
  });
});
