import crypto from 'crypto';
import { KeyPairGenerateOptions, KeyPairClass, EpkResult } from '../types';

export const getEpkGenerator = (KeyPair: KeyPairClass) => {
  const generateEphemeralKeyPair = async (
    opts: KeyPairGenerateOptions = {
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    }
  ): Promise<EpkResult> => {
    const k0 = await KeyPair.generate(opts);
    const epk = await k0.toJwk();
    return {
      keypair: await k0.toJsonWebKey(true),
      epk,
    };
  };
  return generateEphemeralKeyPair;
};
