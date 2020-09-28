import { KeyPairBase } from './KeyPairBase';
import { KeyPairJwk } from './KeyPairJwk';
import { KeyPairBase58 } from './KeyPairBase58';

export interface KeyPairInstance extends KeyPairBase {
  publicKeyBuffer: Buffer;
  privateKeyBuffer?: Buffer;
  toKeyPair: (exportPrivateKey?: boolean) => KeyPairBase58;
  toJsonWebKeyPair: (exportPrivateKey?: boolean) => KeyPairJwk;
}
