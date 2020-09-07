export interface JsonWebKeyPair {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: any;
  privateKeyJwk: any;
}
