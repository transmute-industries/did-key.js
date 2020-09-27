export const keyToDidDoc = (
  didKeyPairInstance: any,
  contentType: string = 'application/did+ld+json'
) => {
  const did = `did:key:${didKeyPairInstance.fingerprint()}`;
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

  const didDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {
        '@base': did,
      },
    ],
    id: did,
    keyAgreement: [externalKeyRepresentation],
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
    const fingerprint = didUri.split('#')[0].split('did:key:').pop();
    const publicKey = await DidKeyPairClass.fromFingerprint({ fingerprint });
    return {
      didDocument: keyToDidDoc(publicKey, resolutionMetaData.accept),
      didDocumentMetaData: {
        'content-type': resolutionMetaData.accept,
      },
      didResolutionMetaData: {},
    };
  };
  return resolve;
};
