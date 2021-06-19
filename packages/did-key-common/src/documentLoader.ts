import { contexts } from './contexts';
export const documentLoader = (iri: string) => {
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  console.error('unsupported iri' + iri);
  throw new Error('unsupported iri' + iri);
};
