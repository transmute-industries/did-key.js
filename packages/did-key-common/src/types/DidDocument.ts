import { LdVerificationMethod } from '@transmute/ld-key-pair';

export interface DidDocument {
  id: string;
  verificationMethod: LdVerificationMethod[];
  assertionMethod?: string[];
  authentication?: string[];
  capabilityInvocation?: string[];
  capabilityDelegation?: string[];
  keyAgreement?: string[];
}
