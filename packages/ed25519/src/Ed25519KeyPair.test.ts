import crypto from 'crypto';
import { Ed25519KeyPair } from './Ed25519KeyPair';
import * as fixtures from './__fixtures__';
describe('Ed25519KeyPair', () => {
  describe('generate', () => {
    it('from random seed', async () => {
      const key = await Ed25519KeyPair.generate({
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      expect(key.id).toBeDefined();
      expect(key.type).toBe('Ed25519VerificationKey2018');
      expect(key.controller).toBeDefined();
      expect(key.publicKeyBase58).toBeDefined();
      expect(key.privateKeyBase58).toBeDefined();
    });

    it('from chosen seed', async () => {
      const key = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      expect(key.id).toBe(fixtures.ed25519_base58btc.id);
      expect(key.type).toBe(fixtures.ed25519_base58btc.type);
      expect(key.controller).toBe(fixtures.ed25519_base58btc.controller);
      expect(key.publicKeyBase58).toBe(
        fixtures.ed25519_base58btc.publicKeyBase58
      );
      expect(key.privateKeyBase58).toBe(
        fixtures.ed25519_base58btc.privateKeyBase58
      );
    });
  });

  describe('from', () => {
    it('from base58', async () => {
      let key: any = await Ed25519KeyPair.from(fixtures.ed25519_base58btc);
      expect(key.id).toBe(fixtures.ed25519_base58btc.id);
    });

    it('from hex', async () => {
      let key: any = await Ed25519KeyPair.from(fixtures.ed25519_hex);
      expect('#' + key.fingerprint()).toBe(fixtures.ed25519_base58btc.id);
      expect(key.publicKey).toBe(fixtures.ed25519_base58btc.publicKeyBase58);
    });

    it('from jwk', async () => {
      let key: any = await Ed25519KeyPair.from(fixtures.ed25519_jwk);
      expect('#' + key.fingerprint()).toBe(fixtures.ed25519_base58btc.id);
      expect(key.publicKey).toBe(fixtures.ed25519_base58btc.publicKeyBase58);
    });
  });

  describe('fromFingerprint', () => {
    it('public key from fingerprint', async () => {
      let key: any = await Ed25519KeyPair.fromFingerprint({
        fingerprint: fixtures.ed25519_base58btc.id.split('#').pop(),
      });
      expect(key.id).toBe('#' + key.fingerprint());
      expect(key.publicKey).toBe(fixtures.ed25519_base58btc.publicKeyBase58);
    });
  });

  describe('fingerprint', () => {
    it('can calculate fingerprint', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      expect(key.id).toBe('#' + key.fingerprint());
    });
  });

  describe('verifyFingerprint', () => {
    it('can verifyFingerprint', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
    });
  });

  describe('sign', () => {
    it('can sign', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      const signer = key.signer();
      const _signature = await signer.sign({
        data: Buffer.from(fixtures.message),
      });
      expect(Buffer.from(_signature).toString('hex')).toBe(fixtures.signature);
    });
  });

  describe('verify', () => {
    it('can verify', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      const verifier = key.verifier();
      const _verified = await verifier.verify({
        data: Buffer.from(fixtures.message),
        signature: Buffer.from(fixtures.signature, 'hex'),
      });
      expect(_verified).toBe(true);
    });
  });

  describe('toJwk', () => {
    it('can convert to Jwk', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      let _jwk = await key.toJwk();
      expect(_jwk).toEqual(fixtures.ed25519_jwk.publicKeyJwk);
      _jwk = await key.toJwk(true);
      expect(_jwk).toEqual(fixtures.ed25519_jwk.privateKeyJwk);
    });
  });

  describe('toHex', () => {
    it('can convert to hex', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      let _publicKeyHex = await key.toHex();
      expect(_publicKeyHex).toBe(fixtures.ed25519_hex.publicKeyHex);
      let _privateKeyHex = await key.toHex(true);
      expect(_privateKeyHex).toBe(fixtures.ed25519_hex.privateKeyHex);
    });
  });

  describe('toX25519KeyPair', () => {
    it('can convert to x25519', async () => {
      let key = await Ed25519KeyPair.generate({
        seed: Buffer.from(fixtures.seed, 'hex'),
      });
      let _key1 = await key.toX25519KeyPair(false);
      expect(_key1.id).toBe(
        '#z6LScqmY9kirLuY22G6CuqBjuMpoqtgWk7bahWjuxFw5xH6G'
      );
      expect(_key1.privateKeyBuffer).toBeUndefined();
      _key1 = await key.toX25519KeyPair(true);
      expect(_key1.privateKeyBuffer).toBeDefined();
    });
  });
});
