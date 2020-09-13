import { Cipher } from './Cipher';
import { X25519KeyPair } from '@transmute/did-key-x25519';

import { keypair } from '../__fixtures__/keypair.json';
import { keyResolver } from '../__fixtures__/keyResolver';

it('can do guide', async () => {
  const cipher = new Cipher(X25519KeyPair);
  const document = { key1: 'value1', key2: 'value2' };
  expect(cipher.version).toBe('recommended');
  const recipients = [
    {
      header: {
        kid:
          keypair[0].X25519KeyAgreementKey2019.controller +
          keypair[0].X25519KeyAgreementKey2019.id,
        alg: 'ECDH-ES+A256KW',
      },
    },
  ];
  const jwe = await cipher.encryptObject({
    obj: { ...document },
    recipients,
    keyResolver,
  });
  expect(jwe.protected).toBeDefined();

  const keyAgreementKey = new X25519KeyPair({
    ...keypair[0].X25519KeyAgreementKey2019,
    id:
      keypair[0].X25519KeyAgreementKey2019.controller +
      keypair[0].X25519KeyAgreementKey2019.id,
  });
  const decryptedObject: any = await cipher.decryptObject({
    jwe,
    keyAgreementKey,
  });
  expect(decryptedObject).toEqual(document);
});
