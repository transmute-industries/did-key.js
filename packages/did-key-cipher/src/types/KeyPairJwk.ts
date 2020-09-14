import { KeyPairBase } from './KeyPairBase';

export interface KeyPairJwk extends KeyPairBase {
  publicKeyJwk: any;
  privateKeyJwk?: any;
}
