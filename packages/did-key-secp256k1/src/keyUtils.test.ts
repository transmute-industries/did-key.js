import keyUtils from './keyUtils';
import {
  rsaKeyExample,
  publicKeyHex,
  privateKeyHex,
  publicKeyJwk,
  privateKeyJwk,
  privateKeyPem,
  publicKeyBase58,
  privateKeyBase58,
} from './__fixtures__';

describe('keyUtils', () => {
  describe('getKid', () => {
    it('should convert a jwk to a kid', async () => {
      const kid = keyUtils.getKid(rsaKeyExample as any);
      expect(kid).toBe('NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs');
    });
  });

  describe('privateKeyJwkFromPrivateKeyHex', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.privateKeyJwkFromPrivateKeyHex(privateKeyHex);
      expect(_jwk).toEqual(privateKeyJwk);
    });
  });

  describe('publicKeyJwkFromPublicKeyHex', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.publicKeyJwkFromPublicKeyHex(publicKeyHex);
      expect(_jwk).toEqual(publicKeyJwk);
    });
  });

  describe('privateKeyJwkFromPrivateKeyPem', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.privateKeyJwkFromPrivateKeyPem(privateKeyPem);
      expect(_jwk).toEqual(privateKeyJwk);
    });
  });

  describe('publicKeyJwkFromPublicKeyPem', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.publicKeyJwkFromPublicKeyPem(privateKeyPem);
      expect(_jwk).toEqual(publicKeyJwk);
    });
  });

  describe('privateKeyHexFromJwk', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _privateKeyHex = await keyUtils.privateKeyHexFromJwk(privateKeyJwk);
      expect(_privateKeyHex).toBe(privateKeyHex);
    });
  });

  describe('publicKeyHexFromJwk', () => {
    it('should convert a jwk to compressed hex', async () => {
      const _publicKeyHex = await keyUtils.publicKeyHexFromJwk(publicKeyJwk);
      expect(_publicKeyHex).toBe(publicKeyHex);
    });
  });

  describe('privateKeyUInt8ArrayFromJwk', () => {
    it('should convert a jwk to UInt8Array', async () => {
      const _privateKeyUInt8Array = await keyUtils.privateKeyUInt8ArrayFromJwk(
        privateKeyJwk
      );
      expect(Buffer.from(_privateKeyUInt8Array).toString('hex')).toBe(
        privateKeyHex
      );
    });
  });

  describe('publicKeyUInt8ArrayFromJwk', () => {
    it('should convert a jwk to UInt8Array', async () => {
      const _publicKeyUInt8Array = await keyUtils.publicKeyUInt8ArrayFromJwk(
        publicKeyJwk
      );
      expect(Buffer.from(_publicKeyUInt8Array).toString('hex')).toBe(
        publicKeyHex
      );
    });
  });

  describe('publicKeyBase58FromPublicKeyHex', () => {
    it('should convert a jwk to base58', async () => {
      const _publicKeyBase58 = await keyUtils.publicKeyBase58FromPublicKeyHex(
        publicKeyHex
      );
      expect(_publicKeyBase58).toBe(publicKeyBase58);
    });
  });

  describe('privateKeyBase58FromPrivateKeyHex', () => {
    it('should convert a jwk to base58', async () => {
      const _privateKeyBase58 = await keyUtils.privateKeyBase58FromPrivateKeyHex(
        privateKeyHex
      );
      expect(_privateKeyBase58).toBe(privateKeyBase58);
    });
  });

  describe('publicKeyHexFromPrivateKeyHex', () => {
    it('should get public key from private key', async () => {
      const _publicKeyHex = await keyUtils.publicKeyHexFromPrivateKeyHex(
        privateKeyHex
      );
      expect(_publicKeyHex).toBe(publicKeyHex);
    });
  });
});
