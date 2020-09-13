import { KeyPairClass, EpkResult } from '../types';

export const getEpkGenerator = (KeyPair: KeyPairClass, opts: any) => {
  const generateEphemeralKeyPair = async (): Promise<EpkResult> => {
    const k0 = await KeyPair.generate(opts);
    const keypair = await k0.toJsonWebKey(true);

    return {
      keypair,
      epk: keypair.publicKeyJwk,
    };
  };
  return generateEphemeralKeyPair;
};
