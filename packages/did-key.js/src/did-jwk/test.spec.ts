import * as did from '../index';

it('can generate old way', async () => {
  const k0 = await did.generate2({
    type: 'ed25519',
    method: 'jwk',
    accept: 'application/did+json',
    seed: '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
    kid: 'key-0',
    didDocument: {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/suites/jws-2020/v1',
      ],
      service: [{ id: '#agent', serviceEndpoint: 'https://api.example.com' }],
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
        'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
      verificationMethod: [
        {
          id:
            'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
          type: 'JsonWebKey2020',
          controller:
            'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
          publicKeyJwk: {
            kid: 'key-0',
            kty: 'OKP',
            crv: 'Ed25519',
            x: 'kYUxJdxcqoKbfJKjTPEmbifNrDBvuQuoGynhwmr4BSA',
          },
        },
      ],
      authentication: [
        'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
      ],
      capabilityInvocation: [
        'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
      ],
      capabilityDelegation: [
        'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
      ],
      keyAgreement: [
        'did:jwk:eyJraWQiOiJrZXktMCIsImt0eSI6Ik9LUCIsImNydiI6IkVkMjU1MTkiLCJ4Ijoia1lVeEpkeGNxb0tiZkpLalRQRW1iaWZOckRCdnVRdW9HeW5od21yNEJTQSJ9',
      ],
    },
  });
});
