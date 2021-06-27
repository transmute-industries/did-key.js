import { X25519KeyPair } from '..';

import { JWE } from '@transmute/jose-ld';

it('can encrypt and decrypt', async () => {
  const k = await X25519KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
        'hex'
      );
    },
  });

  const cipher = new JWE.Cipher(X25519KeyPair);
  const document = { key1: 'value1', key2: 'value2' };
  const recipients = [
    {
      header: {
        kid: k.id,
        alg: 'ECDH-ES+A256KW',
      },
    },
  ];
  const jwe = await cipher.encryptObject({
    obj: document,
    recipients,
    publicKeyResolver: async (id: string) => {
      if (id === k.id) {
        return k.export({ type: 'JsonWebKey2020' });
      }
      throw new Error(
        'publicKeyResolver does not suppport IRI ' + JSON.stringify(id)
      );
    },
  });
  const plaintext = await cipher.decrypt({ jwe, keyAgreementKey: k });
  expect(JSON.parse(Buffer.from(plaintext).toString('utf-8'))).toEqual(
    document
  );
});
