export interface IP384PublicKeyJwk {
  kty: string;
  crv: string;
  x: string;
  y: string;
  kid?: string;
}

export interface IP384PrivateKeyJwk {
  kty: string;
  crv: string;
  x: string;
  y: string;
  d: string;
  kid?: string;
}
