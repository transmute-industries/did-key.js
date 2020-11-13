import {
    documentLoaderFactory,
    contexts,
  } from "@transmute/jsonld-document-loader";
  

  import { driver as webCryptoDriver} from '@transmute/did-key-web-crypto'
  
  const golem = documentLoaderFactory.pluginFactory.build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3C_Verifiable_Credentials,
      ...contexts.W3ID_Security_Vocabulary,
    },
  });
  
  golem.addContext({
    "https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json": require("./lds-jws2020-v1.json"),
  });
  
  golem.addResolver({
    'did:key:': {
      resolve: async (uri) => {
        const { didDocument } = await webCryptoDriver.resolve(uri, {
          accept: 'application/did+json',
        });
        return didDocument;
      },
    },
  })
  
  const documentLoader = golem.buildDocumentLoader();
  
  export { documentLoader };