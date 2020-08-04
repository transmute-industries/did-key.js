import jose from 'jose';
import * as fixtures from '../__fixtures__';

import * as ES384 from '../ES384';

it('jose sign ... we verify', async () => {
  const jwk1 = jose.JWK.asKey({
    ...fixtures.privateKeyJwk,
  } as any);
  const jws = jose.JWS.sign(fixtures.payload, jwk1, fixtures.header);
  const verified = await ES384.verify(fixtures.publicKeyJwk, jws);
  expect(verified).toBe(true);
});

it('we sign ... jose verify', async () => {
  const jwk1 = jose.JWK.asKey({
    ...fixtures.publicKeyJwk,
  } as any);
  const jws = await ES384.sign(
    fixtures.privateKeyJwk,
    fixtures.payload,
    fixtures.header
  );
  const verified = await jose.JWS.verify(jws, jwk1);
  expect(verified).toEqual(fixtures.payload);
});
