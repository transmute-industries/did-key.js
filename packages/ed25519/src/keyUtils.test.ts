import * as keyUtils from './keyUtils';
import * as fixtures from './__fixtures__';

it('publicKeyBase58FromPublicKeyHex', async () => {
  expect(
    keyUtils.publicKeyBase58FromPublicKeyHex(fixtures.ed25519_hex.publicKeyHex)
  ).toBe(fixtures.ed25519_base58btc.publicKeyBase58);
});

it('privateKeyBase58FromPrivateKeyHex', async () => {
  expect(
    keyUtils.privateKeyBase58FromPrivateKeyHex(
      fixtures.ed25519_hex.privateKeyHex
    )
  ).toBe(fixtures.ed25519_base58btc.privateKeyBase58);
});

it('publicKeyJwkFromPublicKeyBase58', async () => {
  expect(
    keyUtils.publicKeyJwkFromPublicKeyBase58(
      fixtures.ed25519_base58btc.publicKeyBase58
    )
  ).toEqual(fixtures.ed25519_jwk.publicKeyJwk);
});

it('privateKeyJwkFromPrivateKeyBase58', async () => {
  expect(
    keyUtils.privateKeyJwkFromPrivateKeyBase58(
      fixtures.ed25519_base58btc.privateKeyBase58
    )
  ).toEqual(fixtures.ed25519_jwk.privateKeyJwk);
});

it('publicKeyBase58FromPublicKeyJwk', async () => {
  expect(
    keyUtils.publicKeyBase58FromPublicKeyJwk(fixtures.ed25519_jwk.publicKeyJwk)
  ).toEqual(fixtures.ed25519_base58btc.publicKeyBase58);
});

it('privateKeyBase58FromPrivateKeyJwk', async () => {
  expect(
    keyUtils.privateKeyBase58FromPrivateKeyJwk(
      fixtures.ed25519_jwk.privateKeyJwk
    )
  ).toEqual(fixtures.ed25519_base58btc.privateKeyBase58);
});

it('publicKeyHexFromPublicKeyBase58', async () => {
  expect(
    keyUtils.publicKeyHexFromPublicKeyBase58(
      fixtures.ed25519_base58btc.publicKeyBase58
    )
  ).toEqual(fixtures.ed25519_hex.publicKeyHex);
});

it('privateKeyHexFromPrivateKeyBase58', async () => {
  expect(
    keyUtils.privateKeyHexFromPrivateKeyBase58(
      fixtures.ed25519_base58btc.privateKeyBase58
    )
  ).toEqual(fixtures.ed25519_hex.privateKeyHex);
});
