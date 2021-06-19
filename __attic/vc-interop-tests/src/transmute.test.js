const { Ed25519KeyPair } = require("@transmute/did-key-ed25519");
const { didCoreConformance } = require("@transmute/did-key-test-vectors");
const vcjs = require("@transmute/vc.js").ld;
const { Ed25519Signature2018 } = require("@transmute/ed25519-signature-2018");
const [example] = didCoreConformance.ed25519.key;
const documentLoader = require("./documentLoader");

const defaultVc = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
  ],
  id: "http://ex.gov/1",
  type: ["VerifiableCredential"],
  issuer: "https://example.edu",
  issuanceDate: "2019-12-11T03:50:55Z",
  credentialSubject: {
    id: "did:ex:2",
  },
};

it.skip("can sign and verify with @transmute/vc.js", async () => {
  const keypair = await Ed25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(example.seed, "hex");
    },
  });
  const suite = new Ed25519Signature2018({
    key: keypair,
    date: "2019-12-11T03:50:55Z",
  });
  // breaks here: https://github.com/transmute-industries/vc.js/blob/master/packages/ed25519-signature-2018/src/Ed25519Signature2018.ts#L46
  const signed = await vcjs.issue({
    credential: {
      ...defaultVc,
      issuer: keypair.controller,
    },
    suite,
    documentLoader,
  });

  // assert issued credential matches static vector
  expect(signed).toEqual(vcConformance.credential);

  const result = await vcjs.verifyCredential({
    credential: signed,
    documentLoader,
    suite,
  });

  expect(result.verified).toBe(true);
});
