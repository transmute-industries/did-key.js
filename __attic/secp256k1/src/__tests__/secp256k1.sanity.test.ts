import crypto from 'crypto';
import secp256k1 from 'secp256k1';
import bs58 from 'bs58';

import { didCoreConformance } from '@transmute/did-key-test-vectors';
const [example] = didCoreConformance.secp256k1.key;

const _secureRandom = () => {
  return crypto.randomBytes(32);
};

const generate = (secureRandom: any) => {
  let privateKey;
  do {
    privateKey = secureRandom();
  } while (!secp256k1.privateKeyVerify(privateKey));

  const publicKey = secp256k1.publicKeyCreate(privateKey);
  return { publicKey, privateKey };
};

it('generate', async () => {
  const key = generate(_secureRandom);
  expect(key.publicKey).toBeDefined();
  expect(key.privateKey).toBeDefined();
});

it('from seed', async () => {
  const key = generate(() => {
    return Buffer.from(example.seed, 'hex');
  });

  expect(bs58.encode(key.publicKey)).toBe(
    example.keypair['application/did+ld+json'].publicKeyBase58
  );
  expect(bs58.encode(key.privateKey)).toBe(
    example.keypair['application/did+ld+json'].privateKeyBase58
  );
});

it('sign / verify', async () => {
  const message = 'hello world';
  const key = generate(() => {
    return Buffer.from(example.seed, 'hex');
  });
  const msg = crypto
    .createHash('sha256')
    .update(message)
    .digest();
  const sigObj: any = secp256k1.ecdsaSign(msg, key.privateKey);
  const _verified = secp256k1.ecdsaVerify(sigObj.signature, msg, key.publicKey);
  expect(_verified).toBe(true);
});
