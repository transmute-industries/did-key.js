import secp256k1 from 'secp256k1';
import crypto from 'crypto';
import {
  privateKeyJwkFromPrivateKeyHex,
  publicKeyJwkFromPublicKeyHex,
} from './keyUtils';
import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance.secp256k1.key;

import { sign, verify, signDetached, recoverPublicKey } from './ES256K-R';

it('ecrecover', () => {
  const message = 'hello world';
  const msg = crypto
    .createHash('sha256')
    .update(message)
    .digest();

  const privateKey = Buffer.from(example.seed, 'hex');
  const publicKey = secp256k1.publicKeyCreate(privateKey);

  const { signature, recid }: any = secp256k1.ecdsaSign(msg, privateKey);
  const recovered = secp256k1.ecdsaRecover(signature, recid, msg);
  expect(recovered).toEqual(publicKey);
});

it('sign / verify', async () => {
  const message = 'hello world';
  const privateKey = Buffer.from(example.seed, 'hex');
  const privateKeyJwk = privateKeyJwkFromPrivateKeyHex(example.seed);
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  const publicKeyJwk = publicKeyJwkFromPublicKeyHex(
    Buffer.from(publicKey).toString('hex')
  );
  const jws = await sign(message, privateKeyJwk);
  const verified = await verify(jws, publicKeyJwk);
  expect(verified).toEqual(message);
});

it('signDetached / recoverPublicKey', async () => {
  const message = Buffer.from('hello world');
  const privateKey = Buffer.from(example.seed, 'hex');
  const privateKeyJwk = privateKeyJwkFromPrivateKeyHex(example.seed);
  const publicKey = secp256k1.publicKeyCreate(privateKey);
  const jws = await signDetached(message, privateKeyJwk);
  const recoveredKey = await recoverPublicKey(jws, message);
  expect(recoveredKey).toEqual(publicKey);
});
