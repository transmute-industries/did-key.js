import { didCoreConformance } from '@transmute/did-key-test-vectors';
import { resolver } from './resolver';

const keyTypes = [
  'ed25519',
  'x25519',
  'secp256k1',
  'bls12381_g1',
  'bls12381_g2',
  'bls12381_g1andg2',
  'p-256',
  'p-384',
  'p-521'
];

const fixContext = (fixture: any) => {
  const fixtureWithExtendedContext = { ...fixture };
  // Add extended did core context in @context
  const contexts = fixtureWithExtendedContext.didDocument['@context'];
  if (
    Array.isArray(contexts) &&
    !contexts.includes('https://ns.did.ai/transmute/v1')
  ) {
    contexts.splice(1, 0, 'https://ns.did.ai/transmute/v1');
  }
  return fixtureWithExtendedContext;
};

const fixKeysArrayName = (fixture: any) => {
  // Rename publicKey to verificationMethod
  const fixtureWithVerificationMethodsArray = { ...fixture };
  if (fixtureWithVerificationMethodsArray.didDocument.publicKey) {
    fixtureWithVerificationMethodsArray.didDocument = {
      ...fixtureWithVerificationMethodsArray.didDocument,
      verificationMethod:
        fixtureWithVerificationMethodsArray.didDocument.publicKey,
    };
    delete fixtureWithVerificationMethodsArray.didDocument.publicKey;
  }
  return fixtureWithVerificationMethodsArray;
};

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
            fixKeysArrayName(
              fixContext(keyFixture.resolution['application/did+ld+json'])
            )
          );
          result = await resolver.resolve(did, {
            accept: 'application/did+json',
          });
          expect(result).toEqual(
            fixKeysArrayName(
              fixContext(keyFixture.resolution['application/did+json'])
            )
          );
        });
      }
    });
  });
});
