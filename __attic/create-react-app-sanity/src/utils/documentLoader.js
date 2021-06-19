import {
    documentLoaderFactory,
    contexts,
  } from '@transmute/jsonld-document-loader';
  
  import { driver } from '@transmute/did-key-ed25519';
  
  const documentLoader = documentLoaderFactory.pluginFactory
    .build({
      contexts: {
        ...contexts.W3C_Decentralized_Identifiers,
        ...contexts.W3C_Verifiable_Credentials,
        ...contexts.W3ID_Security_Vocabulary,
      },
    })
    .addResolver({
      'did:key:z6': {
        resolve: async (uri) => {
          const { didDocument } = await driver.resolve(uri, {
            accept: 'application/did+ld+json',
          });
          return didDocument;
        },
      },
    })
    .buildDocumentLoader();
  
  export { documentLoader };