import { BlsCurveName } from '../types';
import base64url from 'base64url';
import bs58 from 'bs58';
const curveMap: any = {
  Bls12381G1Key2020: BlsCurveName.G1,
  Bls12381G2Key2020: BlsCurveName.G2,
};

export const toJsonWebKeyPair = (keypair: any) => {
  const jsonWebKeyPair: any = {
    id: keypair.id,
    controller: keypair.controller,
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: curveMap[keypair.type],
      x: base64url.encode(bs58.decode(keypair.publicKeyBase58)),
    },
  };

  if (keypair.privateKeyBase58) {
    jsonWebKeyPair.privateKeyJwk = {
      kty: 'EC',
      crv: curveMap[keypair.type],
      x: base64url.encode(bs58.decode(keypair.publicKeyBase58)),
      d: base64url.encode(bs58.decode(keypair.privateKeyBase58)),
    };
  }

  return jsonWebKeyPair;
};
