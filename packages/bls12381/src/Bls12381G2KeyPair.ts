import { Bls12381G2KeyPair as MattrKeyPair } from '@mattrglobal/bls12381-key-pair';
import bs58 from 'bs58';

export class Bls12381G2KeyPair extends MattrKeyPair {
  static fromFingerprint({ fingerprint }: any) {
    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L79
    if (buffer[0] === 0xeb && buffer[1] === 0x01) {
      const publicKeyBase58 = bs58.encode(buffer.slice(2));
      const did = `did:key:${MattrKeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      const keyId = `#${MattrKeyPair.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      return new MattrKeyPair({
        id: keyId,
        controller: did,
        publicKeyBase58,
      });
    }
    throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
  }
}
