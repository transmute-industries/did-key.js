import * as secp256k1 from '../../..';

import { contexts } from './contexts';

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      document: contexts[iri],
    };
  }

  if (iri.startsWith('did:key:zQ3')) {
    const { didDocument } = await secp256k1.resolve(iri, {
      accept: 'application/did+json',
    });
    return {
      document: didDocument,
    };
  }

  const message = `Unsupported iri: ${iri}`;
  console.error(message);
  throw new Error(message);
};
