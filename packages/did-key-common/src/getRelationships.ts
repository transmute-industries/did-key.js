import {
  LdVerificationMethod,
  PublicNodeWithPublicKeyJwk,
} from '@transmute/ld-key-pair';
const signer = [
  'assertionMethod',
  'authentication',
  'capabilityInvocation',
  'capabilityDelegation',
];

const deriveSecret = ['keyAgreement'];

const relationships: any = {
  'OKP Ed25519': [...signer],
  'OKP X25519': [...deriveSecret],

  Ed25519VerificationKey2018: [...signer],
  X25519KeyAgreementKey2019: [...deriveSecret],

  'EC BLS12381_G1': [...signer],
  'EC BLS12381_G2': [...signer],
  Bls12381G1Key2020: [...signer],
  Bls12381G2Key2020: [...signer],

  'EC P-256': [...signer, ...deriveSecret],
  'EC P-384': [...signer, ...deriveSecret],
  'EC P-521': [...signer, ...deriveSecret],
  P256Key2021: [...signer, ...deriveSecret],
  P384Key2021: [...signer, ...deriveSecret],
  P521Key2021: [...signer, ...deriveSecret],

  'EC secp256k1': [...signer, ...deriveSecret],
  EcdsaSecp256k1VerificationKey2019: [...signer, ...deriveSecret],
};

export const getRelationships = (vm: LdVerificationMethod) => {
  const index =
    vm.type === 'JsonWebKey2020'
      ? `${(vm as PublicNodeWithPublicKeyJwk).publicKeyJwk.kty} ${
          (vm as PublicNodeWithPublicKeyJwk).publicKeyJwk.crv
        }`
      : vm.type;
  return [...(relationships[index] || [])];
};
