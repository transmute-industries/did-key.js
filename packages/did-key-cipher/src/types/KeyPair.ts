export type LinkedDataKeyPair = {
  id: string;
  type: string;
  controller: string;
  publicKeyBase58: string;
  privateKeyBase58?: string;
};

export type JsonWebKeyPair = {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: any;
  privateKeyJwk?: any;
};

export type KeyPair = LinkedDataKeyPair | JsonWebKeyPair;
