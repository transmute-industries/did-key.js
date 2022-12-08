import { DidDocument, ResolutionOptions } from './types';
import { getRelationships } from './getRelationships';
import { LdKeyPairStatic, LdVerificationMethod } from '@transmute/ld-key-pair';
import { getSerialized } from './getSerialized';

const fingerprintToKeys = async (
  KeyPair: LdKeyPairStatic,
  fingerprint: string,
  enableEncryptionKeyDerivation?: boolean
) => {
  const key = await KeyPair.fromFingerprint({
    fingerprint,
  });

  // handle ed25519 to x25519
  if (enableEncryptionKeyDerivation && key.getDerivedKeyPairs) {
    return await key.getDerivedKeyPairs();
  }

  // handle pairing friendly curves
  if (key.getPairedKeyPairs) {
    return await key.getPairedKeyPairs();
  }

  return [key];
};

const inferRelationships = (verificationMethod: LdVerificationMethod[]) => {
  const relationships: any = {};
  verificationMethod.forEach((vm) => {
    const types = getRelationships(vm);
    types.forEach((t) => {
      relationships[t] = relationships[t]
        ? [...relationships[t], vm.id]
        : [vm.id];
    });
  });
  return relationships;
};

export const getDidDocument = async (
  did: string,
  KeyPair: LdKeyPairStatic,
  options: ResolutionOptions
): Promise<DidDocument> => {
  const fingerprint = did.split(':')[2].split('#')[0];
  const keys = await fingerprintToKeys(
    KeyPair,
    fingerprint,
    options.enableEncryptionKeyDerivation
  );
  const verificationMethod = await getSerialized(
    keys,
    options.accept,
    false // do not export private keys into a did document
  );

  const relationships = inferRelationships(verificationMethod);
  return { id: did, verificationMethod, ...relationships };
};
