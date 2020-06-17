import jose from 'jose';
import canonicalize from 'canonicalize';
import { X25519KeyPair } from '../X25519KeyPair';
import * as fixtures from '../__fixtures__';

// per the docs:
// ECDH-ES with X25519 and X448 keys is only supported when
// Node.js ^12.17.0 || >=13.9.0 runtime is detected
it('X25519', async () => {
  const jwk1 = jose.JWK.asKey({
    crv: 'X25519',
    x: 'qvWNOYADnXMXjJVlMrPZiyl08dS8wm5RPMlBHmeU4yg',
    d: 'AF42vEEl2Qb2hgrR1d2fbaWak5rJRowtMOk_C1C76HI',
    kty: 'OKP',
    kid: 'r44mKW8ZJ-iO8_7Y0kdeH9aJH61CBfLhIpLsKnyS_M0',
  });

  const jwk2 = jose.JWK.asKey({
    crv: 'X25519',
    x: '4SpbbYhWlKK2dBKaXpg3RaDuP_1EWNtSlLKsqmNVd1Y',
    d: 'eFhReDUMpBVioQjkhKgYcjWiiE30TeQgEbT_6m2Cymw',
    kty: 'OKP',
    kid: 'lKH_xqgpTnDr3N4bdC-ZceHoovY6GEFkFTivJAn9O5Q',
  });

  const payload = Buffer.from(canonicalize({ hello: 'world' }));
  const encrypt = new jose.JWE.Encrypt(payload);
  encrypt.recipient(jwk1);
  encrypt.recipient(jwk2);
  const jwe = encrypt.encrypt('general');
  expect(jwe.recipients.length).toBe(2);
  const plaintext = jose.JWE.decrypt(jwe, jwk1);
  expect(plaintext).toEqual(payload);
});

it('interop', async () => {
  const jwk1 = jose.JWK.asKey({
    ...fixtures.x25519_jwk.privateKeyJwk,
  } as any);
  const jwk2 = jose.JWK.asKey({
    ...(await X25519KeyPair.from(fixtures.x25519_from_ed25519).toJwk(true)),
  } as any);
  const payload = Buffer.from(canonicalize({ hello: 'world' }));
  const encrypt = new jose.JWE.Encrypt(payload);
  encrypt.recipient(jwk1);
  encrypt.recipient(jwk2);
  const jwe = encrypt.encrypt('general');
  expect(jwe.recipients.length).toBe(2);
  expect((jwe.recipients[0].header as any).alg).toBe('ECDH-ES+A128KW');
  const plaintext = jose.JWE.decrypt(jwe, jwk1);
  expect(plaintext).toEqual(payload);
});
