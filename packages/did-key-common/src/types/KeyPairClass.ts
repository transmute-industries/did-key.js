import { KeyPairJwk } from './KeyPairJwk';
import { KeyPairBase58 } from './KeyPairBase58';
import { KeyPairGenerateOptions } from './KeyPairGenerateOptions';

export interface KeyPairClass {
  generate: (options: KeyPairGenerateOptions) => Promise<any>;
  from: (options: KeyPairJwk | KeyPairBase58) => any;
  fromFingerprint: ({ fingerprint }: any) => any;
  fingerprintFromPublicKey: (keypair: KeyPairJwk | KeyPairBase58) => string;
}
