import {
  didCoreConformance,
  getKeyResolver,
} from '@transmute/did-key-test-vectors';

import * as ES256K from './ES256K';

import jose from 'jose';

const [example] = didCoreConformance.secp256k1.jws;

const keyResolver = getKeyResolver(
  didCoreConformance.secp256k1.key,
  'application/did+json'
);

const keypair = keyResolver({ id: example.id });

it('compact sign / verify ', async () => {
  const header = {
    alg: 'ES256K',
  };
  const _jws = await ES256K.sign(
    example.payload,
    keypair.privateKeyJwk,
    header
  );
  const _jws2 = await jose.JWS.sign(
    example.payload,
    jose.JWK.asKey(keypair.privateKeyJwk as any),
    header
  );
  // JOSE ES256K does not produce stable signatures.
  expect(_jws).not.toBe(_jws2);
  expect(_jws).toBe(example.jws.compact);
  const _verified = await ES256K.verify(
    example.jws.compact,
    keypair.publicKeyJwk
  );
  const _verified2 = jose.JWS.verify(
    example.jws.compact,
    jose.JWK.asKey(keypair.publicKeyJwk as any)
  );
  expect(_verified2).toEqual(example.payload);
  expect(_verified).toEqual(example.payload);
});

it('detached sign / verify', async () => {
  const header = {
    alg: 'ES256K',
    b64: false,
    crit: ['b64'],
  };
  // account for non ascii characters
  const payload = Buffer.from(new Uint8Array([127, 128]));
  const _jws = await ES256K.signDetached(
    payload,
    keypair.privateKeyJwk,
    header
  );

  const flat = await jose.JWS.sign.flattened(
    payload,
    jose.JWK.asKey(keypair.privateKeyJwk as any),
    header
  );
  // JOSE ES256K does not produce stable signatures.
  expect(_jws).not.toBe(`${flat.protected}..${flat.signature}`);
  const _verified = await ES256K.verifyDetached(
    _jws,
    payload,
    keypair.publicKeyJwk
  );
  expect(_verified).toBe(true);
});
