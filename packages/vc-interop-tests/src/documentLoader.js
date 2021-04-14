const {
  documentLoaderFactory,
  contexts,
} = require("@transmute/jsonld-document-loader");
const didContext = require('@transmute/did-context');

const { driver } = require("@transmute/did-key-ed25519");

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3C_Verifiable_Credentials,
      ...contexts.W3ID_Security_Vocabulary,
      [didContext.constants
        .DID_CONTEXT_TRANSMUTE_V1_URL]: didContext.contexts.get(
        didContext.constants.DID_CONTEXT_TRANSMUTE_V1_URL
      ),
    },
  })
  .addResolver({
    ['did:key:z6M']: {
      resolve: async (did) => {
        const { didDocument } = await driver.resolve(did);
        return didDocument;
      },
    },
  })
  .buildDocumentLoader();

module.exports = documentLoader;
