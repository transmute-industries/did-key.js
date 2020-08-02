import jose from 'jose';
import * as fixtures from './__fixtures__';
import * as keyUtils from './keyUtils';

it('thumbprint', async () => {
  const jwk1 = jose.JWK.asKey({
    ...fixtures.publicKeyJwk,
  } as any);
  const kid = keyUtils.getKid(fixtures.publicKeyJwk);
  expect(kid).toEqual(jwk1.kid);
});

it('publicKeyJwkToPublicKeyBase58', async () => {
  const publicKeyBase58 = keyUtils.publicKeyJwkToPublicKeyBase58(
    fixtures.publicKeyJwk
  );
  expect(publicKeyBase58).toEqual(fixtures.publicKeyBase58);
});

it('publicKeyBase58toPublicKeyJwk', async () => {
  const publicKeyJwk = keyUtils.publicKeyBase58toPublicKeyJwk(
    fixtures.publicKeyBase58
  );
  const expected = { ...fixtures.publicKeyJwk };
  delete publicKeyJwk.kid;
  delete expected.key_ops;
  delete expected.ext;
  expect(publicKeyJwk).toEqual(expected);
});

it('privateKeyJwkToPrivateKeyBase58', async () => {
  const privateKeyBase58 = keyUtils.privateKeyJwkToPrivateKeyBase58(
    fixtures.privateKeyJwk
  );
  expect(privateKeyBase58).toEqual(fixtures.privateKeyBase58);
});

it('privateKeyBase58toPrivateKeyJwk', async () => {
  const privateKeyJwk = keyUtils.privateKeyBase58toPrivateKeyJwk(
    fixtures.privateKeyBase58,
    fixtures.publicKeyBase58
  );
  const expected = { ...fixtures.privateKeyJwk };
  delete privateKeyJwk.kid;
  delete expected.key_ops;
  delete expected.ext;
  expect(privateKeyJwk).toEqual(expected);
});
