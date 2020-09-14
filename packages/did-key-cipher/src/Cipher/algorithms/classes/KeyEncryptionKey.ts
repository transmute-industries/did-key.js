import { default as bs64 } from 'base64url';
import { AESKW } from '@stablelib/aes-kw';

export interface CreateKekOptions {
  keyData: Uint8Array;
}

export interface WrapKeyOptions {
  unwrappedKey: Uint8Array;
}

export interface UnwrapKeyOptions {
  wrappedKey: string; //base64url
}

export class KeyEncryptionKey {
  public aeskw: AESKW;
  public algorithm: any;

  static createKek = async ({ keyData }: CreateKekOptions) => {
    return new KeyEncryptionKey(keyData);
  };

  constructor(key: Uint8Array) {
    if (key.length !== 32) {
      throw new Error('key must be 32 bytes');
    }
    this.aeskw = new AESKW(key);
    this.algorithm = { name: 'A256KW' };
  }

  /**
   * Wraps a cryptographic key.
   *
   * @param {object} options - The options to use.
   * @param {Uint8Array} options.unwrappedKey - The key material as a
   *   `Uint8Array`.
   *
   * @returns {string} - The base64url-encoded wrapped key bytes.
   */
  wrapKey({ unwrappedKey }: WrapKeyOptions): string {
    const wrappedKey = this.aeskw.wrapKey(unwrappedKey);
    return bs64.encode(Buffer.from(wrappedKey));
  }

  /**
   * Unwraps a cryptographic key.
   *
   * @param {object} options - The options to use.
   * @param {string} options.wrappedKey - The wrapped key material as a
   *   base64url-encoded string.
   *
   * @returns {Uint8Array} - Resolves to the key bytes or null if
   *   the unwrapping fails because the key does not match.
   */
  unwrapKey({ wrappedKey }: UnwrapKeyOptions): Uint8Array | null {
    const _wrappedKey = bs64.toBuffer(wrappedKey);
    try {
      return this.aeskw.unwrapKey(_wrappedKey);
    } catch (e) {
      // decryption failed
      console.error(e);
      return null;
    }
  }
}
