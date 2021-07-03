import { getGenerator, getResolver } from '@transmute/did-key-common';
import {
  Bls12381G1KeyPair,
  Bls12381G2KeyPair,
  Bls12381KeyPairs,
} from '@transmute/bls12381-key-pair';

export { Bls12381G1KeyPair, Bls12381G2KeyPair, Bls12381KeyPairs };
export const generate = getGenerator(Bls12381KeyPairs as any);
export const resolve = getResolver(Bls12381KeyPairs as any);
