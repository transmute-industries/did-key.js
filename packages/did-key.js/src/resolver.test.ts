import { didCoreConformance } from '@transmute/did-key-test-vectors';
import { resolver } from './resolver';

Object.keys(didCoreConformance).map((k) => {
  const keyTypeFixture = didCoreConformance[k].key;
  describe(k, () => {
    keyTypeFixture.forEach((keyFixture: any) => {
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
    });
  });
});
