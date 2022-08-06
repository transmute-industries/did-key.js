import * as did from '../index';

it('method generator interface', async () => {
  const k0 = await did.jwk.generate({
    type: 'ed25519',
    method: 'jwk',
    accept: 'application/did+json',
    secureRandom: () => {
      return Buffer.from(
        '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
        'hex'
      );
    },
  });

  expect(k0).toEqual({
    keys: [
      {
        id:
          'did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT#z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT',
        controller: 'did:key:z6MkpFJxUgQgYKK68fmokaCWwpRYoWdG3LzZR6dLFXvdJvAT',
        type: 'JsonWebKey2020',
        publicKeyJwk: {
          kty: 'OKP',
          crv: 'Ed25519',
          x: 'kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA',
        },
        privateKeyJwk: {
          kty: 'OKP',
          crv: 'Ed25519',
          x: 'kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA',
          d: 'TmG8GRjqakeuMwczG-d5gZahqOfP5Lbo98ml82AX2Sk',
        },
      },
    ],
    didDocument: {
      id:
        'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ',
      verificationMethod: [
        {
          id:
            'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ#0',
          type: 'JsonWebKey2020',
          controller:
            'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ',
          publicKeyJwk: {
            kty: 'OKP',
            crv: 'Ed25519',
            x: 'kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA',
          },
        },
      ],
      authentication: [
        'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ#0',
      ],
      capabilityInvocation: [
        'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ#0',
      ],
      capabilityDelegation: [
        'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ#0',
      ],
      keyAgreement: [
        'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwieCI6ImtZVXhKZHhjcW9LYmZKS2pUUEVtYmlmTnJEQnZ1UXVvR3luaHdtcjRCU0EifQ#0',
      ],
    },
  });
});
