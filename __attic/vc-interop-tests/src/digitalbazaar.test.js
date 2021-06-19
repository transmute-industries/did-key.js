const { Ed25519KeyPair } = require("@transmute/did-key-ed25519");
const {
  didCoreConformance,
  vcConformance,
} = require("@transmute/did-key-test-vectors");
const vcjs = require("vc-js");
const jsigs = require("jsonld-signatures");
const { Ed25519Signature2018 } = jsigs.suites;
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

it("can sign and verify with jsonld-signatures and vc-js", async () => {
  const keypair = await Ed25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(example.seed, "hex");
    },
  });
  keypair.id = keypair.controller + keypair.id;
  const suite = new Ed25519Signature2018({
    key: keypair,
    date: "2019-12-11T03:50:55Z",
  });
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
