import bs58 from 'bs58';
import { deriveSecret } from './Jwe';

import { keypair } from '../__fixtures__';

import { deriveKey } from './EcdhKdf';

import { TextEncoder } from 'util';

const encoder = new TextEncoder();

it('can deriveKey', async () => {
  const secret: Uint8Array = await deriveSecret(
    keypair[0].generate.privateKeyJwk,
    keypair[0].generate.publicKeyJwk
  );
  const producerInfo: Uint8Array = bs58.decode(
    keypair[0].fromJwk.publicKeyBase58
  );
  const keyAgreementKeyId =
    keypair[0].fromJwk.controller + keypair[0].fromJwk.id;
  const consumerInfo: Uint8Array = encoder.encode(keyAgreementKeyId);
  const key = await deriveKey({ secret, producerInfo, consumerInfo });
  expect(Buffer.from(key).toString('hex')).toBe(
    '5b160a48ab916759541b3336625c542e5d5e91f7c351d4b4b0afff84ee7bdfd3'
  );
});
