import crypto from 'crypto';

import { X25519KeyPair } from './X25519KeyPair';
import * as fixtures from './__fixtures__';

describe('X25519KeyPair', () => {
  describe('fingerprintFromPublicKey', () => {
    it('from random seed', async () => {
      let fingerprint: any = await X25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58: fixtures.x25519_base58btc.publicKeyBase58,
      });
      expect('#' + fingerprint).toBe(fixtures.x25519_base58btc.id);
    });
  });

  describe('generate', () => {
    it('from random seed', async () => {
      let key: any = await X25519KeyPair.generate({
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      expect(key.id).toBeDefined();
    });
    it('from chosen seed', async () => {
      let key: any = await X25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      expect(key).toEqual(fixtures.x25519_base58btc);
    });
  });
  describe('from', () => {
    it('from base58', async () => {
      let key: any = await X25519KeyPair.from(fixtures.x25519_base58btc);
      expect(key.id).toBe(fixtures.x25519_base58btc.id);
    });
    it('from jwk', async () => {
      let key: any = await X25519KeyPair.from(fixtures.x25519_jwk);
      expect('#' + key.fingerprint()).toBe(fixtures.x25519_base58btc.id);
      expect(key.publicKey).toBe(fixtures.x25519_base58btc.publicKeyBase58);
    });
    it('from hex', async () => {
      let key: any = await X25519KeyPair.from(fixtures.x25519_hex);
      expect('#' + key.fingerprint()).toBe(fixtures.x25519_base58btc.id);
      expect(key.publicKey).toBe(fixtures.x25519_base58btc.publicKeyBase58);
    });
  });

  describe('fromEdKeyPair', () => {
    it('from ed25519', async () => {
      let key: any = await X25519KeyPair.fromEdKeyPair(
        fixtures.ed25519_base58btc
      );
      expect(key).toEqual(fixtures.x25519_from_ed25519);
    });
  });

  describe('fromFingerprint', () => {
    it('public key from fingerprint', async () => {
      let key: any = await X25519KeyPair.fromFingerprint({
        fingerprint: fixtures.x25519_base58btc.id.split('#').pop(),
      });
      expect(key.id).toBe('#' + key.fingerprint());
      expect(key.publicKey).toBe(fixtures.x25519_base58btc.publicKeyBase58);
    });
  });
  describe('fingerprint', () => {
    it('can calculate fingerprint', async () => {
      let key: any = await X25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      expect(key.id).toBe('#' + key.fingerprint());
    });
  });
  describe('verifyFingerprint', () => {
    it('can verifyFingerprint', async () => {
      let key: any = await X25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
    });
  });

  describe('toJwk', () => {
    it('can convert to Jwk', async () => {
      let key: any = await X25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      let _jwk = await key.toJwk();
      expect(_jwk).toEqual(fixtures.x25519_jwk.publicKeyJwk);
      _jwk = await key.toJwk(true);
      expect(_jwk).toEqual(fixtures.x25519_jwk.privateKeyJwk);
    });
  });
  describe('toHex', () => {
    it('can convert to hex', async () => {
      let key: any = await X25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      let _publicKeyHex = await key.toHex();
      expect(_publicKeyHex).toBe(fixtures.x25519_hex.publicKeyHex);
      let _privateKeyHex = await key.toHex(true);
      expect(_privateKeyHex).toBe(fixtures.x25519_hex.privateKeyHex);
    });
  });

  describe('deriveSecret', () => {
    it('can convert to hex', async () => {
      let key = await X25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      const secret = key.deriveSecret({
        publicKey: fixtures.x25519_from_ed25519,
      });
      expect(Buffer.from(secret).toString('hex')).toBe(fixtures.derivedSecret);
    });
  });
});
