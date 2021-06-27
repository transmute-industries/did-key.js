import * as ed25519 from '../../..';

import { contexts } from './contexts';

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      document: contexts[iri],
    };
  }

  if (iri.startsWith('did:key:z6M')) {
    const { didDocument } = await ed25519.resolve(iri, {
      accept: 'application/did+ld+json',
    });
    return {
      document: didDocument,
    };
  }

  const message = `Unsupported iri: ${iri}`;
  console.error(message);
  throw new Error(message);
};
