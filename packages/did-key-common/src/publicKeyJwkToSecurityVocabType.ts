export const publicKeyJwkToSecurityVocabType: any = {
  'OKP Ed25519': 'Ed25519VerificationKey2018',
  'OKP X25519': 'X25519KeyAgreementKey2019',

  'EC BLS12381_G1': 'Bls12381G1Key2020',
  'EC BLS12381_G2': 'Bls12381G2Key2020',

  'EC P-256': 'P256Key2021',
  'EC P-384': 'P384Key2021',
  'EC P-521': 'P521Key2021',

  'EC secp256k1': 'EcdsaSecp256k1VerificationKey2019',
};
