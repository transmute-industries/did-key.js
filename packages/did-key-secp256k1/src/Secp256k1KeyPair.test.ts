import crypto from 'crypto';
import { Secp256k1KeyPair } from './Secp256k1KeyPair';
import {
  seed,
  message,
  signature,
  secp256k1_key_base58btc,
  secp256k1_key_jwk,
  secp256k1_key_hex,
  // secp256k1_key_hex,
} from './__fixtures__';

describe('Secp256k1KeyPair', () => {
  describe('generate', () => {
    it('from random seed', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      expect(key.id).toBeDefined();
    });

    it('from chosen seed', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      expect(key).toEqual(secp256k1_key_base58btc);
    });
  });

  describe('from', () => {
    it('from base58', async () => {
      let key: any = await Secp256k1KeyPair.from(secp256k1_key_base58btc);
      expect(key.id).toBe(secp256k1_key_base58btc.id);
    });

    it('from jwk', async () => {
      let key: any = await Secp256k1KeyPair.from(secp256k1_key_jwk);
      expect('#' + key.fingerprint()).toBe(secp256k1_key_base58btc.id);
      expect(key.publicKey).toBe(secp256k1_key_base58btc.publicKeyBase58);
    });

    it('from hex', async () => {
      let key: any = await Secp256k1KeyPair.from(secp256k1_key_hex);
      expect('#' + key.fingerprint()).toBe(secp256k1_key_base58btc.id);
      expect(key.publicKey).toBe(secp256k1_key_base58btc.publicKeyBase58);
    });
  });

  describe('fromFingerprint', () => {
    it('public key from fingerprint', async () => {
      let key: any = await Secp256k1KeyPair.fromFingerprint({
        fingerprint: secp256k1_key_base58btc.id.split('#').pop(),
      });
      expect(key.id).toBe('#' + key.fingerprint());
      expect(key.publicKey).toBe(secp256k1_key_base58btc.publicKeyBase58);
    });
  });

  describe('fingerprint', () => {
    it('can calculate fingerprint', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      expect(key.id).toBe('#' + key.fingerprint());
    });
  });

  describe('verifyFingerprint', () => {
    it('can verifyFingerprint', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
    });
  });

  describe('sign', () => {
    it('can sign', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      const signer = key.signer();
      const _signature = await signer.sign({ data: message });
      expect(Buffer.from(_signature).toString('hex')).toBe(signature);
    });
  });

  describe('verify', () => {
    it('can verify', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      const verifier = key.verifier();
      const _verified = await verifier.verify({
        data: message,
        signature: Buffer.from(signature, 'hex'),
      });
      expect(_verified).toBe(true);
    });
  });

  describe('toJwk', () => {
    it('can convert to Jwk', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      let _jwk = await key.toJwk();
      expect(_jwk.d).toBeUndefined();
      _jwk = await key.toJwk(true);
      expect(_jwk.d).toBeDefined();
    });
  });

  describe('toHex', () => {
    it('can convert to hex', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      let _publicKeyHex = await key.toHex();
      expect(_publicKeyHex).toBe(
        '021813316af99ef807c85432aa23a581278579c1922db3127d9ae8713c1ca59474'
      );
      let _privateKeyHex = await key.toHex(true);
      expect(_privateKeyHex).toBe(
        '9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017'
      );
    });
  });
});
