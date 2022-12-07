import { LdKeyPairStatic, LdKeyPairInstance } from '@transmute/ld-key-pair';
import { getResolver } from './getResolver';
import { getSerialized } from './getSerialized';

const getKeys = async (key: LdKeyPairInstance) => {
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
    resolutionOptions: any = { accept: 'application/did+json' }
  ) => {
    const key = await KeyPairClass.generate(keyGenOptions);
    const keys = await getKeys(key);
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
