import doc0 from './doc-0.json';
import doc0Ld from './doc-0.ld.json';

import doc1 from './doc-1.json';
import doc1Ld from './doc-1.ld.json';

import doc2 from './doc-2.json';
import doc2Ld from './doc-2.ld.json';

export const documents: any = [
  {
    did: doc0.id,
    'application/did+json': doc0,
    'application/did+ld+json': doc0Ld,
  },
  {
    did: doc1.id,
    'application/did+json': doc1,
    'application/did+ld+json': doc1Ld,
  },
  {
    did: doc2.id,
    'application/did+json': doc2,
    'application/did+ld+json': doc2Ld,
  },
];
