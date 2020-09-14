import crypto from 'crypto';
import bs58 from 'bs58';
import * as x25519 from '@stablelib/x25519';
import { keypair } from '../__fixtures__/keypair.json';

it('generate', async () => {
  const key = x25519.generateKeyPair();
  expect(key.publicKey).toBeDefined();
  expect(key.secretKey).toBeDefined();
});

it('from seed', async () => {
  const key = x25519.generateKeyPair({
    isAvailable: true,
    randomBytes: () => {
      return Buffer.from(keypair[0].seed, 'hex');
    },
  });
  expect(bs58.encode(key.publicKey)).toBe(
    keypair[0].X25519KeyAgreementKey2019.publicKeyBase58
  );
  expect(bs58.encode(key.secretKey)).toBe(
    keypair[0].X25519KeyAgreementKey2019.privateKeyBase58
  );
});

it('sharedKey', async () => {
  const scalarMultipleResult = x25519.sharedKey(
    new Uint8Array(
      bs58.decode(keypair[0].X25519KeyAgreementKey2019.privateKeyBase58)
    ),
    new Uint8Array(
      bs58.decode(keypair[0].X25519KeyAgreementKey2019.publicKeyBase58)
    ),
    true
  );

  const key = crypto
    .createHash('sha256')
    .update(scalarMultipleResult)
    .digest();
  expect(key.toString('hex')).toEqual(
    '6413377c9515ace0e95fc1efc36c690bc2758a76cc4307bcf5676c615659c268'
  );
});
