import { EpkResult } from './EpkResult';

import { KeyPairJwk } from './KeyPairJwk';
import { KeyPairBase58 } from './KeyPairBase58';

export interface KeyEncryptionKeyFromStaticPublicKeyOptions {
  ephemeralKeyPair: EpkResult;
  staticPublicKey: KeyPairJwk | KeyPairBase58;
}
