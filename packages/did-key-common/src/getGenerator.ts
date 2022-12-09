import { LdKeyPairStatic, LdKeyPairInstance } from '@transmute/ld-key-pair';
import { getResolver } from './getResolver';
import { getSerialized } from './getSerialized';
import { ResolutionOptions } from './types';

const getKeys = async (key: LdKeyPairInstance, resolutionOptions: ResolutionOptions) => {
  // handle ed25519 to x25519
  if (resolutionOptions.enableEncryptionKeyDerivation && key.getDerivedKeyPairs) {
    return await key.getDerivedKeyPairs();
  }

  // handle pairing friendly curves
  if (key.getPairedKeyPairs) {
    return await key.getPairedKeyPairs();
  }

  return [key];
};

export const getGenerator = (KeyPairClass: LdKeyPairStatic) => {
  const resolve = getResolver(KeyPairClass);
  return async (
    keyGenOptions: any,
    resolutionOptions: ResolutionOptions = {
      accept: 'application/did+json',
      enableEncryptionKeyDerivation: false,
    }
  ) => {
    const key = await KeyPairClass.generate(keyGenOptions);
    const keys = await getKeys(key, resolutionOptions);
    const { didDocument } = await resolve(key.controller, resolutionOptions);
    const exportPrivateKeys = true;
    return {
      didDocument,
      keys: await getSerialized(
        keys,
        resolutionOptions.accept,
        exportPrivateKeys
      ),
    };
  };
};
