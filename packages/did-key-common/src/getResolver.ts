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
  const did = `did:key:${didKeyPairInstance.fingerprint()}`;
  const externalKeyRepresentation = getVerificationMethod(
    didKeyPairInstance,
    contentType
  );
  let verificationRelationships: any = {
    verificationMethod: [externalKeyRepresentation],
  };

  if (didKeyPairInstance.verifier) {
    verificationRelationships = {
      ...verificationRelationships,
      authentication: [externalKeyRepresentation.id],
      assertionMethod: [externalKeyRepresentation.id],
      capabilityInvocation: [externalKeyRepresentation.id],
      capabilityDelegation: [externalKeyRepresentation.id],
    };
  }

  if (didKeyPairInstance.deriveSecret) {
    verificationRelationships = {
      ...verificationRelationships,
      keyAgreement: [externalKeyRepresentation.id],
    };
  }

  if (didKeyPairInstance.type === 'Ed25519VerificationKey2018') {
    const kek = await didKeyPairInstance.toX25519KeyPair(false);
    const externalKeyRepresentation2 = getVerificationMethod(kek, contentType);
    verificationRelationships = {
      ...verificationRelationships,
      verificationMethod: [
        ...verificationRelationships.verificationMethod,
        externalKeyRepresentation2,
      ],
      keyAgreement: [externalKeyRepresentation2.id],
    };
  }

  // imagine if people injected ads like this....
  // verificationRelationships = {
  //   ...verificationRelationships,
  //   service: [
  //     {
  //       id: '#provider',
  //       type: 'ServiceProvider',
  //       serviceEndpoint: 'https://transmute.industries',
  //     },
  //   ],
  // };

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

  // Here is were I would delete a property for JSON-only
  // If I wanted to conform to the DID Core JSON Production Rules.
  return didDocument;
};

// resolve ( did, did-resolution-input-metadata )
//      -> ( did-resolution-metadata, did-document, did-document-metadata )
export const getResolve = (DidKeyPairClass: any) => {
  const resolve = async (
    didUri: string,
    resolutionMetaData: any = { accept: 'application/did+ld+json' }
  ) => {
    const fingerprint = didUri
      .split('#')[0]
      .split('did:key:')
      .pop();
    const publicKey = await DidKeyPairClass.fromFingerprint({ fingerprint });
    return {
      didDocument: await keyToDidDoc(publicKey, resolutionMetaData.accept),
      didDocumentMetaData: {
        'content-type': resolutionMetaData.accept,
      },
      didResolutionMetaData: {},
    };
  };
  return resolve;
};
