import * as ed25519 from '..';

import * as did from '@transmute/did-context';
import * as sec from '@transmute/security-context';
import * as cre from '@transmute/credentials-context';

const contexts: any = {
  [did.constants.DID_CONTEXT_V1_URL]: did.contexts.get(
    did.constants.DID_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V1_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V1_URL
  ),
  [sec.constants.SECURITY_CONTEXT_V2_URL]: sec.contexts.get(
    sec.constants.SECURITY_CONTEXT_V2_URL
  ),
  [cre.constants.CREDENTIALS_CONTEXT_V1_URL]: cre.contexts.get(
    cre.constants.CREDENTIALS_CONTEXT_V1_URL
  ),
  [sec.constants.ED25519_2018_v1_URL]: sec.contexts.get(
    sec.constants.ED25519_2018_v1_URL
  ),
  [sec.constants.X25519_2019_v1_URL]: sec.contexts.get(
    sec.constants.X25519_2019_v1_URL
  ),
};

export const documentLoader = async (iri: string) => {
  if (iri.startsWith('did:key:z6M')) {
    const { didDocument } = await ed25519.resolve(iri, {
      accept: 'application/did+ld+json',
    });
    return {
      documentUrl: iri,
      document: didDocument,
    };
  }
  if (contexts[iri]) {
    return {
      documentUrl: iri,
      document: contexts[iri],
    };
  }
  console.error('Unsupported iri: ' + iri);
  throw new Error('Unsupported iri: ' + iri);
};
