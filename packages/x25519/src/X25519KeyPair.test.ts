import crypto from 'crypto';

import { X25519KeyPair } from './X25519KeyPair';

import { keypair } from './__fixtures__/keypair.json';
import ed25519 from './__fixtures__/ed25519.json';

describe('X25519KeyPair', () => {
  describe('fingerprintFromPublicKey', () => {
    it('from random seed', async () => {
      let fingerprint = await X25519KeyPair.fingerprintFromPublicKey({
        publicKeyBase58: keypair[0].X25519KeyAgreementKey2019.publicKeyBase58,
      });
      expect('#' + fingerprint).toBe(keypair[0].X25519KeyAgreementKey2019.id);
    });
  });

  describe('generate', () => {
    it('from random seed', async () => {
      let key = await X25519KeyPair.generate({
        secureRandom: () => {
          return crypto.randomBytes(32);
        },
      });
      expect(key.id).toBeDefined();
    });
    it('from chosen seed', async () => {
      let key = await X25519KeyPair.generate({
        seed: Buffer.from(keypair[0].seed, 'hex'),
      });
      expect(key).toEqual(keypair[0].X25519KeyAgreementKey2019);
    });
  });
  describe('from', () => {
    it('from base58', async () => {
      let key = await X25519KeyPair.from(keypair[0].X25519KeyAgreementKey2019);
      expect(key.id).toBe(keypair[0].X25519KeyAgreementKey2019.id);
    });
    it('from jwk', async () => {
      let key = await X25519KeyPair.from(keypair[0].JsonWebKey2020);
      expect('#' + key.fingerprint()).toBe(keypair[0].JsonWebKey2020.id);
      expect(key.publicKey).toBe(
        keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
      );
    });
  });

  describe('fromEdKeyPair', () => {
    it('from ed25519', async () => {
      let key = await X25519KeyPair.fromEdKeyPair(ed25519);
      expect(key).toEqual({
        type: 'X25519KeyAgreementKey2019',
        id: '#z6LScqmY9kirLuY22G6CuqBjuMpoqtgWk7bahWjuxFw5xH6G',
        controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
        publicKeyBase58: '2AbNdSuzFSpGvsiSPBfnamcKzk9Q3WRRpY2EToHZEuKW',
        privateKeyBase58: '96do29HaLryHStVdCD7jB5TdbM1iGwPUDJvnPkfcqhMB',
      });
    });
  });

  describe('fromFingerprint', () => {
    it('public key from fingerprint', async () => {
      let key = await X25519KeyPair.fromFingerprint({
        fingerprint: keypair[0].X25519KeyAgreementKey2019.id.split('#').pop(),
      });
      expect(key.id).toBe('#' + key.fingerprint());
      expect(key.publicKey).toBe(
        keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
      );
    });
  });
  describe('fingerprint', () => {
    it('can calculate fingerprint', async () => {
      let key = await X25519KeyPair.generate({
        seed: Buffer.from(keypair[0].seed, 'hex'),
      });
      expect(key.id).toBe('#' + key.fingerprint());
    });
  });
  describe('verifyFingerprint', () => {
    it('can verifyFingerprint', async () => {
      let key = await X25519KeyPair.generate({
        seed: Buffer.from(keypair[0].seed, 'hex'),
      });
      expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
    });
  });

  describe('toJwk', () => {
    it('can convert to Jwk', async () => {
      let key: any = await X25519KeyPair.generate({
        seed: Buffer.from(keypair[0].seed, 'hex'),
      });
      let _jwk = await key.toJwk();
      delete _jwk.kid;
      expect(_jwk).toEqual(keypair[0].JsonWebKey2020.publicKeyJwk);
      _jwk = await key.toJwk(true);
      delete _jwk.kid;
      expect(_jwk).toEqual(keypair[0].JsonWebKey2020.privateKeyJwk);
    });
  });

  describe('deriveSecret', () => {
    it('can convert to hex', async () => {
      let key = await X25519KeyPair.generate({
        seed: Buffer.from(keypair[0].seed, 'hex'),
      });
      const secret = key.deriveSecret({
        publicKey: keypair[1].X25519KeyAgreementKey2019,
      });
      expect(Buffer.from(secret).toString('hex')).toBe(
        '85deaad59be8c5a157b644acbc311beb8902d4cb3799d2d87c839e975c472e40'
      );
    });
  });
});
