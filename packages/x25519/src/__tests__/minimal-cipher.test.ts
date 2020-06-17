import { Cipher } from 'minimal-cipher';

import { X25519KeyPair } from '../X25519KeyPair';

import * as fixtures from '../__fixtures__';

const cipher = new Cipher();

export const keyResolver = ({ id }: any) => {
  let keyAgreementKey = fixtures.x25519_from_ed25519;
  if (keyAgreementKey.id === id) {
    return keyAgreementKey;
  }
  throw new Error(`Key ${id} not found in fixtures`);
};

const keyAgreementKey = new X25519KeyPair(fixtures.x25519_from_ed25519);

const recipient = {
  header: {
    kid: keyAgreementKey.id,
    alg: 'ECDH-ES+A256KW',
  },
};

const recipients = [recipient];

it('encrypt and decrypt object', async () => {
  const obj = { key: 'value' };
  const jwe = await cipher.encryptObject({ obj, recipients, keyResolver });
  expect(jwe.protected).toBeDefined();
  const decryptedObject: any = await cipher.decryptObject({
    jwe,
    keyAgreementKey,
  });
  expect(decryptedObject.key).toBe(obj.key);
});
