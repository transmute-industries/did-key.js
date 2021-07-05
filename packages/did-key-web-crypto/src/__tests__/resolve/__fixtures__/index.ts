import all from './all.json';

export const documents: any = all.map((d) => {
  return {
    did: d.did,
    'application/did+json': d['application/did+json'].didDocument,
    'application/did+ld+json': d['application/did+ld+json'].didDocument,
  };
});
