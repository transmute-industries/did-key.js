import * as web from '../../..';

import { contexts } from './contexts';

export const documentLoader = async (iri: string) => {
  if (contexts[iri]) {
    return {
      document: contexts[iri],
    };
  }

  if (iri.startsWith('did:key')) {
    const { didDocument } = await web.resolve(iri, {
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
