import { KeyPairBase } from './KeyPairBase';

export interface KeyPairBase58 extends KeyPairBase {
  publicKeyBase58: string;
  privateKeyBase58?: string;
}
