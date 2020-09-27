import {
  didCoreConformance,
  getKeyResolver,
} from '@transmute/did-key-test-vectors';

// only supports X25519KeyAgreementKey2019
import { Cipher } from 'minimal-cipher';
const { X25519KeyPair } = require('x25519-key-pair');

const cipher = new Cipher();
const document = { key1: 'value1', key2: 'value2' };

it('minimal cipher can decrypt did-key-cipher', async () => {
  const supported = didCoreConformance.x25519.jwe.filter((data: any) => {
    return data.keyType === 'X25519KeyAgreementKey2019';
  });
  expect(didCoreConformance.x25519.jwe.length).toBe(10);
  expect(supported.length).toBe(5);

  const keyResolver = getKeyResolver(
    didCoreConformance.x25519.key,
    'application/did+ld+json'
  );

  for (let i = 0; i < supported.length; i++) {
    const { id, jwe } = supported[i];
    const rawKeyPair = keyResolver({ id });
    const keyAgreementKey = new X25519KeyPair(rawKeyPair);
    const decryptedObject: any = await cipher.decryptObject({
      jwe,
      keyAgreementKey,
    });
    expect(decryptedObject).toEqual(document);
  }
});
