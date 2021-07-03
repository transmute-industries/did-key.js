import { Secp256k1KeyPair } from '..';

import { JWE, JWS } from '@transmute/jose-ld';

it('can sign and verify', async () => {
  const k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c',
        'hex'
      );
    },
  });
  const JWA_ALG = 'ES256K';
  const signer = JWS.createSigner(k.signer('Ecdsa'), JWA_ALG);
  const verifier = JWS.createVerifier(k.verifier('Ecdsa'), JWA_ALG);
  const message = Uint8Array.from(Buffer.from('hello'));
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({
    signature,
  });
  expect(verified);
});

it('can encrypt and decrypt', async () => {
  const k = await Secp256k1KeyPair.generate({
    secureRandom: () => {
      return Buffer.from(
        '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c',
        'hex'
      );
    },
  });

  const cipher = new JWE.Cipher(Secp256k1KeyPair);
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
