import { KeyPair } from './KeyPair';

const getVerificationMethod = (
  instance: any,
  contentType: string = 'application/did+ld+json'
) => {
  switch (contentType) {
    case 'application/did+json': {
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
];

const keyToDidDoc = async (
  didKeyPairInstance: any,
  contentType: string = 'application/did+ld+json'
) => {
  if (supportedContentTypes.indexOf(contentType) === -1) {
    throw new Error('Unsupported DID Document representation. ' + contentType);
  }
  const did = `did:key:${await didKeyPairInstance.fingerprint()}`;
  const externalKeyRepresentation = await getVerificationMethod(
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

// resolve ( did, did-resolution-input-metadata )
//      -> ( did-resolution-metadata, did-document, did-document-metadata )
const getResolve = (DidKeyPairClass: any) => {
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

    return didResolutionResponse;
  };
  return resolve;
};

export const resolve = getResolve(KeyPair);
