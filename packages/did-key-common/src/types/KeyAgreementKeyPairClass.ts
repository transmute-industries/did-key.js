import { ECDH_ES_A256KW } from './JWE_ALG';
import { KeyPairClass } from './KeyPairClass';

export interface KeyAgreementKeyPairClass extends KeyPairClass {
  JWE_ALG: ECDH_ES_A256KW;

  generateEphemeralKeyPair: (epkArgs: any) => any;
  kekFromEphemeralPeer: ({ keyAgreementKey, epk }: any) => any;
  kekFromStaticPeer: ({ ephemeralKeyPair, staticPublicKey }: any) => any;
}
