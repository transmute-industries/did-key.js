import { Cipher } from 'minimal-cipher';

import { keypair } from '../__fixtures__/keypair.json';
import { keyResolver } from '../__fixtures__/keyResolver';

const cipher = new Cipher();
const document = { key1: 'value1', key2: 'value2' };

it('can do simple encryption', async () => {
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
});
