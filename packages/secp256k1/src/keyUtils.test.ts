import * as keyUtils from './keyUtils';
import bs58 from 'bs58';
import { didCoreConformance } from '@transmute/did-key-test-vectors';

const [example] = didCoreConformance.secp256k1.key;

describe('getKid', () => {
  it('should convert a jwk to a kid', async () => {
    const kid = keyUtils.getKid(
      example.keypair['application/did+json'].publicKeyJwk
    );
    expect(kid).toBeDefined();
  });
});

describe('privateKeyJwkFromPrivateKeyHex', () => {
  it('should convert a hex encoded keyUtils to a Jwk', async () => {
    const _jwk = await keyUtils.privateKeyJwkFromPrivateKeyHex(
      bs58
        .decode(example.keypair['application/did+ld+json'].privateKeyBase58)
        .toString('hex')
    );
    delete _jwk.kid;
    expect(_jwk).toEqual(example.keypair['application/did+json'].privateKeyJwk);
  });
});

describe('publicKeyJwkFromPublicKeyHex', () => {
  it('should convert a hex encoded keyUtils to a Jwk', async () => {
    const _jwk = await keyUtils.publicKeyJwkFromPublicKeyHex(
      bs58
        .decode(example.keypair['application/did+ld+json'].publicKeyBase58)
        .toString('hex')
    );
    delete _jwk.kid;
    expect(_jwk).toEqual(example.keypair['application/did+json'].publicKeyJwk);
  });
});

describe('privateKeyHexFromJwk', () => {
  it('should convert a hex encoded keyUtils to a Jwk', async () => {
    const _privateKeyHex = await keyUtils.privateKeyHexFromJwk(
      example.keypair['application/did+json'].privateKeyJwk
    );
    expect(_privateKeyHex).toBe(
      bs58
        .decode(example.keypair['application/did+ld+json'].privateKeyBase58)
        .toString('hex')
    );
  });
});

describe('publicKeyHexFromJwk', () => {
  it('should convert a jwk to compressed hex', async () => {
    const _publicKeyHex = await keyUtils.publicKeyHexFromJwk(
      example.keypair['application/did+json'].publicKeyJwk
    );
    expect(_publicKeyHex).toBe(
      bs58
        .decode(example.keypair['application/did+ld+json'].publicKeyBase58)
        .toString('hex')
    );
  });
});
