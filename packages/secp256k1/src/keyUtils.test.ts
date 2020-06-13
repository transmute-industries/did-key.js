import * as keyUtils from './keyUtils';

import * as fixtures from './__fixtures__';

describe('keyUtils', () => {
  describe('getKid', () => {
    it('should convert a jwk to a kid', async () => {
      const kid = keyUtils.getKid(fixtures.rsaKeyExample as any);
      expect(kid).toBe('NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs');
    });
  });

  describe('privateKeyJwkFromPrivateKeyHex', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.privateKeyJwkFromPrivateKeyHex(
        fixtures.privateKeyHex
      );
      expect(_jwk).toEqual(fixtures.privateKeyJwk);
    });
  });

  describe('publicKeyJwkFromPublicKeyHex', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.publicKeyJwkFromPublicKeyHex(
        fixtures.publicKeyHex
      );
      expect(_jwk).toEqual(fixtures.publicKeyJwk);
    });
  });

  describe('privateKeyJwkFromPrivateKeyPem', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.privateKeyJwkFromPrivateKeyPem(
        fixtures.privateKeyPem
      );
      expect(_jwk).toEqual(fixtures.privateKeyJwk);
    });
  });

  describe('publicKeyJwkFromPublicKeyPem', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _jwk = await keyUtils.publicKeyJwkFromPublicKeyPem(
        fixtures.privateKeyPem
      );
      expect(_jwk).toEqual(fixtures.publicKeyJwk);
    });
  });

  describe('privateKeyHexFromJwk', () => {
    it('should convert a hex encoded keyUtils to a Jwk', async () => {
      const _privateKeyHex = await keyUtils.privateKeyHexFromJwk(
        fixtures.privateKeyJwk
      );
      expect(_privateKeyHex).toBe(fixtures.privateKeyHex);
    });
  });

  describe('publicKeyHexFromJwk', () => {
    it('should convert a jwk to compressed hex', async () => {
      const _publicKeyHex = await keyUtils.publicKeyHexFromJwk(
        fixtures.publicKeyJwk
      );
      expect(_publicKeyHex).toBe(fixtures.publicKeyHex);
    });
  });

  describe('privateKeyUInt8ArrayFromJwk', () => {
    it('should convert a jwk to UInt8Array', async () => {
      const _privateKeyUInt8Array = await keyUtils.privateKeyUInt8ArrayFromJwk(
        fixtures.privateKeyJwk
      );
      expect(Buffer.from(_privateKeyUInt8Array).toString('hex')).toBe(
        fixtures.privateKeyHex
      );
    });
  });

  describe('publicKeyUInt8ArrayFromJwk', () => {
    it('should convert a jwk to UInt8Array', async () => {
      const _publicKeyUInt8Array = await keyUtils.publicKeyUInt8ArrayFromJwk(
        fixtures.publicKeyJwk
      );
      expect(Buffer.from(_publicKeyUInt8Array).toString('hex')).toBe(
        fixtures.publicKeyHex
      );
    });
  });

  describe('publicKeyBase58FromPublicKeyHex', () => {
    it('should convert a jwk to base58', async () => {
      const _publicKeyBase58 = await keyUtils.publicKeyBase58FromPublicKeyHex(
        fixtures.publicKeyHex
      );
      expect(_publicKeyBase58).toBe(fixtures.publicKeyBase58);
    });
  });

  describe('privateKeyBase58FromPrivateKeyHex', () => {
    it('should convert a jwk to base58', async () => {
      const _privateKeyBase58 = await keyUtils.privateKeyBase58FromPrivateKeyHex(
        fixtures.privateKeyHex
      );
      expect(_privateKeyBase58).toBe(fixtures.privateKeyBase58);
    });
  });

  describe('publicKeyHexFromPrivateKeyHex', () => {
    it('should get public key from private key', async () => {
      const _publicKeyHex = await keyUtils.publicKeyHexFromPrivateKeyHex(
        fixtures.privateKeyHex
      );
      expect(_publicKeyHex).toBe(fixtures.publicKeyHex);
    });
  });
});
