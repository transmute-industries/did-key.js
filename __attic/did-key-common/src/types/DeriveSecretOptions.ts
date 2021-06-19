import { KeyPairJwk } from './KeyPairJwk';
import { KeyPairBase58 } from './KeyPairBase58';

export interface DeriveSecretOptions {
  publicKey: KeyPairJwk | KeyPairBase58;
}
