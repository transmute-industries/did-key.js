import { Cipher } from '@transmute/did-key-cipher';
import { KeyPair } from '../KeyPair';

const testKeypair = {
  id:
    '#zXwpCNGaoAK2oF6cU7WBS2GU2uhKUfca2CCB3LonW2hNYvdqzTFcZc8CtF2HbGGPF9zGdcncQsbFZ2yaNzEvHEkRebyj',
  type: 'JsonWebKey2020',
  controller:
    'did:key:zXwpCNGaoAK2oF6cU7WBS2GU2uhKUfca2CCB3LonW2hNYvdqzTFcZc8CtF2HbGGPF9zGdcncQsbFZ2yaNzEvHEkRebyj',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'nGIngOzKufAHoWmGDohjFPwnOOupl4nfEXIbuLFvxgM',
    y: '2fUTIgIIMwXsmkUXnOGULbgBzPxrsr1KmXeAXqgQawo',
  },
  privateKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'nGIngOzKufAHoWmGDohjFPwnOOupl4nfEXIbuLFvxgM',
    y: '2fUTIgIIMwXsmkUXnOGULbgBzPxrsr1KmXeAXqgQawo',
    d: 'KRW5Ms5psy02CLzsxpFWFdOfoa3JqpsrngMSDBcsLlY',
  },
};

it('can do p256', async () => {
  const cipher = new Cipher(KeyPair);
  const document = { key1: 'value1', key2: 'value2' };
  expect(cipher.version).toBe('recommended');
  const recipients = [
    {
      header: {
        kid: testKeypair.controller + testKeypair.id,
        alg: 'ECDH-ES+A256KW',
      },
    },
  ];
  const jwe = await cipher.encryptObject({
    obj: { ...document },
    recipients,
    keyResolver: (_uri: string) => {
      return testKeypair;
    },
  });
  expect(jwe.protected).toBeDefined();

  const keyAgreementKey = new KeyPair({
    ...testKeypair,
  });
  const decryptedObject: any = await cipher.decryptObject({
    jwe,
    keyAgreementKey,
  });
  expect(decryptedObject).toEqual(document);
});
