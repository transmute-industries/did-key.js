import { ResolutionOptions, ResolutionResponse } from './types';
import { getDidDocument } from './getDidDocument';
import { factory, DidDocument } from '@did-core/data-model';
import { representation } from '@did-core/did-ld-json';
import { getContext } from './getContext';
import { documentLoader } from './documentLoader';
import { LdKeyPairStatic } from '@transmute/ld-key-pair';
export const getResolver = (KeyPairClass: LdKeyPairStatic) => {
  return async (
    did: string,
    options: ResolutionOptions = {
      accept: 'application/did+ld+json',
      enableEncryptionKeyDerivation: false,
    }
  ): Promise<ResolutionResponse> => {
    const didDocumentEntries = await getDidDocument(did, KeyPairClass, options);

    const context = getContext(didDocumentEntries);
    // console.log(JSON.stringify(context, null));

    const didDocument: DidDocument = factory.build({
      entries: {
        '@context': context,
        ...didDocumentEntries,
      },
    });

    const serialized: Buffer = await didDocument
      .addRepresentation({ 'application/did+json': representation })
      .addRepresentation({ 'application/did+ld+json': representation })
      .produce(options.accept, documentLoader);

    return {
      didDocument: JSON.parse(serialized.toString('utf-8')),
    };
  };
};
