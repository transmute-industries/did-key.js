const {
  documentLoaderFactory,
  contexts,
} = require("@transmute/jsonld-document-loader");

const { driver } = require("@transmute/did-key-ed25519");

const documentLoader = documentLoaderFactory.pluginFactory
  .build({
    contexts: {
      ...contexts.W3C_Decentralized_Identifiers,
      ...contexts.W3C_Verifiable_Credentials,
      ...contexts.W3ID_Security_Vocabulary,
    },
  })
  .addContext({
    'https://ns.did.ai/transmute/v1': {
      '@context': [
        {
          '@version': 1.1,
        },
        'https://www.w3.org/ns/did/v1',
        {
          JsonWebKey2020: 'https://w3id.org/security#JsonWebKey2020',
          Ed25519VerificationKey2018:
            'https://w3id.org/security#Ed25519VerificationKey2018',
          X25519KeyAgreementKey2019:
            'https://w3id.org/security#X25519KeyAgreementKey2019',

          publicKeyJwk: {
            '@id': 'https://w3id.org/security#publicKeyJwk',
            '@type': '@json',
          },
          publicKeyBase58: {
            '@id': 'https://w3id.org/security#publicKeyBase58',
          },
        },
      ],
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
