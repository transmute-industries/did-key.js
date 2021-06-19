import { types } from '@transmute/did-key-common';

export const getEpkGenerator = (KeyPair: types.KeyPairClass, opts: any) => {
  const generateEphemeralKeyPair = async (): Promise<types.EpkResult> => {
    const k0 = await KeyPair.generate(opts);
    const keypair = await k0.toJsonWebKeyPair(true);

    return {
      keypair,
      epk: keypair.publicKeyJwk,
    };
  };
  return generateEphemeralKeyPair;
};
