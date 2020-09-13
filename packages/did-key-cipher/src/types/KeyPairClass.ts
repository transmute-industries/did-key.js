import { KeyPair } from './KeyPair';

export interface KeyPairClass {
  generate: (args: any) => Promise<any>;
  from: (args: KeyPair) => any;
  fromFingerprint: ({ fingerprint }: any) => any;
  fingerprintFromPublicKey: (keypair: KeyPair) => string;
}
