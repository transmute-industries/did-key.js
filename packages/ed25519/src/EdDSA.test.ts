import {
  didCoreConformance,
  getKeyResolver,
} from '@transmute/did-key-test-vectors';

import * as EdDSA from './EdDSA';

import jose from 'jose';

const [example] = didCoreConformance.ed25519.jws;

const keyResolver = getKeyResolver(
  didCoreConformance.ed25519.key,
  'application/did+json'
);

const keypair = keyResolver({ id: example.id });

it('compact sign / verify ', async () => {
  const header = {
    alg: 'EdDSA',
  };
  const _jws = await EdDSA.sign(example.payload, keypair.privateKeyJwk, header);
  const _jws2 = await jose.JWS.sign(
    example.payload,
    jose.JWK.asKey(keypair.privateKeyJwk as any),
    header
  );
  expect(_jws).toBe(_jws2);
  expect(_jws).toBe(example.jws.compact);
  const _verified = await EdDSA.verify(
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
    alg: 'EdDSA',
    b64: false,
    crit: ['b64'],
  };
  // account for non ascii characters
  const payload = Buffer.from(new Uint8Array([127, 128]));
  const _jws = await EdDSA.signDetached(payload, keypair.privateKeyJwk, header);
  const flat = await jose.JWS.sign.flattened(
    payload,
    jose.JWK.asKey(keypair.privateKeyJwk as any),
    header
  );
  expect(_jws).toBe(`${flat.protected}..${flat.signature}`);
  const _verified = await EdDSA.verifyDetached(
    _jws,
    payload,
    keypair.publicKeyJwk
  );
  expect(_verified).toBe(true);
});
