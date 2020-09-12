import bs58 from 'bs58';
import base64url from 'base64url';
import { Base58KeyPair } from '../types';

export const base58KeyPairToJwk = (keypair: Base58KeyPair): object => {
  const publicKeyBuffer = bs58.decode(keypair.publicKeyBase58);

  const x = base64url.encode(
    publicKeyBuffer.slice(0, publicKeyBuffer.length / 2)
  );

  const y = base64url.encode(publicKeyBuffer.slice(publicKeyBuffer.length / 2));

  let jwk: any = { x, y };

  if (keypair.privateKeyBase58) {
    jwk.d = base64url.encode(bs58.decode(keypair.privateKeyBase58));
  }

  return jwk;
};
