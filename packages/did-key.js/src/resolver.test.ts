import { didCoreConformance } from '@transmute/did-key-test-vectors';
import { resolver } from './resolver';

const keyTypes = [
  'ed25519',
  'x25519',
  'secp256k1',
  'bls12381_g1',
  'bls12381_g2',
  'bls12381_g1andg2',
  // Not supported:
  // 'p-256',
  // 'p-384',
  // 'p-521'
];

keyTypes.map((k) => {
  const keyTypeFixture = didCoreConformance[k].key;
  describe(k, () => {
    keyTypeFixture.forEach((keyFixture: any) => {
      if (keyFixture.g1) {
        const did = keyFixture.g1['application/did+json'].controller;
        it(did, async () => {
          let result = await resolver.resolve(did);
          expect(result).toEqual(
            keyFixture.resolution['application/did+ld+json']
          );
          result = await resolver.resolve(did, {
            accept: 'application/did+json',
          });
          expect(result).toEqual(keyFixture.resolution['application/did+json']);
        });
      } else {
        const did = keyFixture.keypair['application/did+json'].controller;
        it(did, async () => {
          let result = await resolver.resolve(did);
          expect(result).toEqual(
            keyFixture.resolution['application/did+ld+json']
          );
          result = await resolver.resolve(did, {
            accept: 'application/did+json',
          });
          expect(result).toEqual(keyFixture.resolution['application/did+json']);
        });
      }
    });
  });
});
