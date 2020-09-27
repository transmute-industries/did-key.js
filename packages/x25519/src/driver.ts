import { X25519KeyPair } from './X25519KeyPair';

export const keyToDidDoc = (
  x25519Key: X25519KeyPair,
  contentType: string = 'application/did+ld+json'
) => {
  const did = `did:key:${x25519Key.fingerprint()}`;
  let externalKeyRepresentation;
  switch (contentType) {
    case 'application/did+json': {
      externalKeyRepresentation = x25519Key.toJsonWebKeyPair();
      break;
    }
    case '*/*':
    case 'application/did+ld+json': {
      externalKeyRepresentation = x25519Key.toKeyPair();
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

export const get = async ({ did, url }: any = {}) => {
  did = did || url;
  if (!did) {
    throw new TypeError('"did" must be a string.');
  }
  const fingerprint = did
    .split('#')[0]
    .split('did:key:')
    .pop();
  const publicKey = await X25519KeyPair.fromFingerprint({ fingerprint });
  const didDoc = keyToDidDoc(publicKey);
  return didDoc;
};

// resolve ( did, did-resolution-input-metadata )
//      -> ( did-resolution-metadata, did-document, did-document-metadata )

export const resolve = async (
  didUri: string,
  resolutionMetaData: any = { accept: 'application/did+ld+json' }
) => {
  const fingerprint = didUri
    .split('#')[0]
    .split('did:key:')
    .pop();

  const publicKey = await X25519KeyPair.fromFingerprint({ fingerprint });

  return {
    didDocument: keyToDidDoc(publicKey, resolutionMetaData.accept),
    didDocumentMetaData: {
      'content-type': resolutionMetaData.accept,
    },
    didResolutionMetaData: {},
  };
};
