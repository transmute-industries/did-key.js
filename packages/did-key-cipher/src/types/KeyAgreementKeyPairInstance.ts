import { KeyPairInstance } from './KeyPairInstance';

import { DeriveSecretOptions } from './DeriveSecretOptions';

export interface KeyAgreementKeyPairInstance extends KeyPairInstance {
  deriveSecret: (options: DeriveSecretOptions) => Promise<Uint8Array>;
}
