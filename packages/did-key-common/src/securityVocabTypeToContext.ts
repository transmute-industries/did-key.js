import * as sc from '@transmute/security-context';

export const securityVocabTypeToContext: any = {
  JsonWebKey2020: sc.constants.JSON_WEB_SIGNATURE_2020_V1_URL,

  Ed25519VerificationKey2018: sc.constants.ED25519_2018_v1_URL,
  X25519KeyAgreementKey2019: sc.constants.X25519_2019_v1_URL,

  Bls12381G1Key2020: sc.constants.BLS12381_2020_V1_URL,
  Bls12381G2Key2020: sc.constants.BLS12381_2020_V1_URL,

  P256Key2021: sc.constants.MULTIKEY_2021_V1_URL,
  P384Key2021: sc.constants.MULTIKEY_2021_V1_URL,
  P521Key2021: sc.constants.MULTIKEY_2021_V1_URL,

  EcdsaSecp256k1VerificationKey2019: sc.constants.SECP256k1_2019_v1_URL,
};
