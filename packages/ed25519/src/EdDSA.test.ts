import * as EdDSA from './EdDSA';
import * as fixtures from './__fixtures__';

import jose from 'jose';

it('sign', async () => {
  const header = {
    alg: 'EdDSA',
  };
  const _jws = await EdDSA.sign(
    fixtures.payload,
    fixtures.ed25519_jwk.privateKeyJwk,
    header
  );
  const _jws2 = await jose.JWS.sign(
    fixtures.payload,
    jose.JWK.asKey(fixtures.ed25519_jwk.privateKeyJwk as any),
    header
  );
  expect(_jws).toBe(_jws2);
  expect(_jws).toBe(fixtures.jws);
});

it('verify', async () => {
  const _verified = await EdDSA.verify(
    fixtures.jws,
    fixtures.ed25519_jwk.publicKeyJwk
  );
  const _verified2 = jose.JWS.verify(
    fixtures.jws,
    jose.JWK.asKey(fixtures.ed25519_jwk.publicKeyJwk as any)
  );
  expect(_verified2).toEqual(fixtures.payload);
  expect(_verified).toEqual(fixtures.payload);
});

it('signDetached', async () => {
  const header = {
    alg: 'EdDSA',
    b64: false,
    crit: ['b64'],
  };
  const payload = Buffer.from(new Uint8Array([127, 128]));
  const _jws = await EdDSA.signDetached(
    payload,
    fixtures.ed25519_jwk.privateKeyJwk,
    header
  );
  const flat = await jose.JWS.sign.flattened(
    payload,
    jose.JWK.asKey(fixtures.ed25519_jwk.privateKeyJwk as any),
    header
  );
  expect(_jws).toBe(`${flat.protected}..${flat.signature}`);
  expect(_jws).toBe(fixtures.detached_jws);
});

it('verifyDetached', async () => {
  const payload = Buffer.from(new Uint8Array([127, 128]));
  const _verified = await EdDSA.verifyDetached(
    fixtures.detached_jws,
    payload,
    fixtures.ed25519_jwk.publicKeyJwk
  );
  expect(_verified).toBe(true);
});
