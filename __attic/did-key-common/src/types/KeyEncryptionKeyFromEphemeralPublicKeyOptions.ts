import { KeyAgreementKeyPairInstance } from './KeyAgreementKeyPairInstance';

export interface KeyEncryptionKeyFromEphemeralPublicKeyOptions {
  keyAgreementKey: KeyAgreementKeyPairInstance;
  epk: any;
}
