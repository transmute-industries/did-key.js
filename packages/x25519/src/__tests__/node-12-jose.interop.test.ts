import jose from 'jose';
import canonicalize from 'canonicalize';
import { X25519KeyPair } from '../X25519KeyPair';

import { keypair } from '../__fixtures__/keypair.json';

// per the docs:
// ECDH-ES with X25519 and X448 keys is only supported when
// Node.js ^12.17.0 || >=13.9.0 runtime is detected
it('node jose interop', async () => {
  const jwk1 = jose.JWK.asKey({
    ...keypair[0].JsonWebKey2020.privateKeyJwk,
  } as any);
  const jwk2 = jose.JWK.asKey({
    ...(await X25519KeyPair.from(keypair[1].X25519KeyAgreementKey2019).toJwk(
      true
    )),
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
