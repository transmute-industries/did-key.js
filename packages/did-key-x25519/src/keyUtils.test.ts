import * as fixtures from './__fixtures__';
import * as keyUtils from './keyUtils';

// https://tools.ietf.org/html/rfc8037#appendix-A.3
it('getKid', async () => {
  const kid = keyUtils.getKid({
    crv: 'Ed25519',
    kty: 'OKP',
    x: '11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo',
  });
  expect(kid).toBe('kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k');
});

it('publicKeyJwkFromPublicKeyBase58', async () => {
  const _jwk = keyUtils.publicKeyJwkFromPublicKeyBase58(
    fixtures.x25519_base58btc.publicKeyBase58
  );
  expect(_jwk).toEqual(fixtures.x25519_jwk.publicKeyJwk);
});

it('privateKeyJwkFromPrivateKeyBase58', async () => {
  const _jwk = keyUtils.privateKeyJwkFromPrivateKeyBase58(
    fixtures.x25519_base58btc.publicKeyBase58,
    fixtures.x25519_base58btc.privateKeyBase58
  );
  expect(_jwk).toEqual(fixtures.x25519_jwk.privateKeyJwk);
});

it('privateKeyHexFromPrivateKeyBase58', async () => {
  const _privateKeyHex = keyUtils.privateKeyHexFromPrivateKeyBase58(
    fixtures.x25519_base58btc.privateKeyBase58
  );
  expect(_privateKeyHex).toEqual(fixtures.x25519_hex.privateKeyHex);
});

it('publicKeyHexFromPublicKeyBase58', async () => {
  const _privateKeyHex = keyUtils.publicKeyHexFromPublicKeyBase58(
    fixtures.x25519_base58btc.publicKeyBase58
  );
  expect(_privateKeyHex).toEqual(fixtures.x25519_hex.publicKeyHex);
});

it('privateKeyBase58FromPrivateKeyJwk', async () => {
  const _privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyJwk(
    fixtures.x25519_jwk.privateKeyJwk
  );
  expect(_privateKeyBase58).toEqual(fixtures.x25519_base58btc.privateKeyBase58);
});

it('publicKeyBase58FromPublicKeyJwk', async () => {
  const _publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyJwk(
    fixtures.x25519_jwk.publicKeyJwk
  );
  expect(_publicKeyBase58).toEqual(fixtures.x25519_base58btc.publicKeyBase58);
});

it('privateKeyBase58FromPrivateKeyHex', async () => {
  const _privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyHex(
    fixtures.x25519_hex.privateKeyHex
  );
  expect(_privateKeyBase58).toEqual(fixtures.x25519_base58btc.privateKeyBase58);
});

it('publicKeyBase58FromPublicKeyHex', async () => {
  const _publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyHex(
    fixtures.x25519_hex.publicKeyHex
  );
  expect(_publicKeyBase58).toEqual(fixtures.x25519_base58btc.publicKeyBase58);
});
