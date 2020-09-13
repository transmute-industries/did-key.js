import { KeyPair } from './KeyPair';
import { KeyPairGenerateOptions } from './KeyPairGenerateOptions';
export interface KeyPairClass {
  generate: (options: KeyPairGenerateOptions) => Promise<any>;
  from: (args: KeyPair) => any;
  fromFingerprint: ({ fingerprint }: any) => any;
  fingerprintFromPublicKey: (keypair: KeyPair) => string;
}
