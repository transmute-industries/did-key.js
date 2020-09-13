import { KeyPairBase } from './KeyPairBase';

export interface KeyPairInstance extends KeyPairBase {
  publicKeyBuffer: Buffer;
  privateKeyBuffer?: Buffer;
}
