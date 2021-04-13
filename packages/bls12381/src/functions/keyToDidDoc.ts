import { Bls12381KeyPairs } from '../Bls12381KeyPairs';

export const getVerificationMethod = (
  instance: any,
  contentType: string = 'application/did+ld+json'
) => {
  switch (contentType) {
    case 'application/did+json': {
      return instance.toJsonWebKeyPair();
    }
    case 'application/did+cbor': {
      return instance.toJsonWebKeyPair();
    }
    case 'application/did+ld+json': {
      return instance.toKeyPair();
    }
  }
  throw new Error(
    'This implementation of did:key for bls12381 does not support: ' +
      contentType
  );
};

export const keyToDidDoc = async (
  didKeyPairInstance: any,
  contentType: string = 'application/did+ld+json'
) => {
  let verificationRelationships: any = {
    verificationMethod: [],
  };
  const did = `did:key:${didKeyPairInstance.fingerprint()}`;
  if (didKeyPairInstance.type === 'Bls12381KeyPairs2020') {
    const g1 = getVerificationMethod(
      (didKeyPairInstance as Bls12381KeyPairs).g1KeyPair,
      contentType
    );
    const g2 = getVerificationMethod(
      (didKeyPairInstance as Bls12381KeyPairs).g2KeyPair,
      contentType
    );
    verificationRelationships.verificationMethod.push(g1);
    verificationRelationships.verificationMethod.push(g2);
    verificationRelationships = {
      ...verificationRelationships,
      authentication: [g1.id, g2.id],
      assertionMethod: [g1.id, g2.id],
      capabilityInvocation: [g1.id, g2.id],
      capabilityDelegation: [g1.id, g2.id],
    };
  } else {
    const vm = getVerificationMethod(didKeyPairInstance, contentType);
    verificationRelationships.verificationMethod.push(vm);
    verificationRelationships = {
      ...verificationRelationships,
      authentication: [vm.id],
      assertionMethod: [vm.id],
      capabilityInvocation: [vm.id],
      capabilityDelegation: [vm.id],
    };
  }

  const didDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://ns.did.ai/transmute/v1',
      {
        '@base': did,
      },
    ],
    id: did,
    ...verificationRelationships,
  };

  return didDocument;
};
