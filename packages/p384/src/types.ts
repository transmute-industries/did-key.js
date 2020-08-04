export const verificationMethodType = 'JsonWebKey2020';

export type P384PublicKeyJwk = {
  kty: 'EC';
  crv: 'P-384';
  x: string;
  y: string;
  kid?: string;
};

export type P384PrivateKeyJwk = {
  kty: 'EC';
  crv: 'P-384';
  x: string;
  y: string;
  d: string;
  kid?: string;
};

export type JsonWebKey2020PublicKeyJwk = P384PublicKeyJwk;
export type JsonWebKey2020PrivateKeyJwk = P384PrivateKeyJwk;

export type JsonWebKey2020 = {
  id: string;
  type: 'JsonWebKey2020';
  controller: string;
  publicKeyJwk: JsonWebKey2020PublicKeyJwk;
  privateKeyJwk?: JsonWebKey2020PrivateKeyJwk;
};
