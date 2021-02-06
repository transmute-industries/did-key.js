const cbor = require('borc');

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
    'This implementation of did:key does not support: ' + contentType
  );
};

const supportedContentTypes = [
  'application/did+json',
  'application/did+ld+json',
  'application/did+cbor',
];

export const keyToDidDoc = async (
  didKeyPairInstance: any,
  contentType: string = 'application/did+ld+json'
) => {
  if (supportedContentTypes.indexOf(contentType) === -1) {
    throw new Error('Unsupported DID Document representation. ' + contentType);
  }
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
    const didDocument = await keyToDidDoc(publicKey, resolutionMetaData.accept);

    const didResolutionResponse = {
      '@context': 'https://w3id.org/did-resolution/v1',
      didDocument,
      didDocumentMetadata: {
        'content-type': resolutionMetaData.accept,
      },
      didResolutionMetadata: {},
    };
    if (resolutionMetaData.accept === 'application/did+cbor') {
      return cbor.encode(didResolutionResponse);
    }
    return didResolutionResponse;
  };
  return resolve;
};
