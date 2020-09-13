import crypto from 'crypto';

export const getEpkGenerator = (KeyPair: any) => {
  const generateEphemeralKeyPair = async (
    opts: any = {
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    }
  ) => {
    const k0 = await KeyPair.generate(opts);
    const epk = await k0.toJwk();
    return {
      keypair: await k0.toJsonWebKey(true),
      epk,
    };
  };
  return generateEphemeralKeyPair;
};
