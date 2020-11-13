import { Bls12381KeyPairs } from '../Bls12381KeyPairs';
export const getVerificationMethod = (
  didKeyPairInstance: any,
  contentType: string = 'application/did+ld+json'
) => {
  let externalKeyRepresentation;
  switch (contentType) {
    case 'application/did+json': {
      externalKeyRepresentation = didKeyPairInstance.toJsonWebKeyPair();
      break;
    }
    case '*/*':
    case 'application/did+ld+json': {
      externalKeyRepresentation = didKeyPairInstance.toKeyPair();
      break;
    }
    default: {
      throw new Error(
        'This implementation of did:key does not support: ' + contentType
      );
    }
  }
  return externalKeyRepresentation;
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
      {
        '@base': did,
      },
    ],
    id: did,
    ...verificationRelationships,
  };

  return didDocument;
};
