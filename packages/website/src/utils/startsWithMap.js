import * as ed25519 from '@transmute/did-key-ed25519';
import * as secp256k1 from '@transmute/did-key-secp256k1';
import * as x25519 from '@transmute/did-key-x25519';
import * as bls12381 from '@transmute/did-key-bls12381';
import * as web from '@transmute/did-key-web-crypto';

export const typeMap = {
  ed25519,
  x25519,
  secp256r1: web,
  secp384r1: web,
  secp521r1: web,

  secp256k1,
  bls12381,
};

export const startsWithMap = {
  'did:key:z6Mk': ed25519,
  'did:key:z6LS': x25519,

  // broke
  'did:key:zQ3s': secp256k1,
  'did:key:z5Tc': bls12381,
};
