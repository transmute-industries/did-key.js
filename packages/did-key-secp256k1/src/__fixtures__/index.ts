export const rsaKeyExample = {
  alg: 'RS256',
  e: 'AQAB',
  kid: '2011-04-29',
  kty: 'RSA',
  n:
    '0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw',
};

export const publicKeyJwk = {
  crv: 'secp256k1',
  kid: 'JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw',
  kty: 'EC',
  x: 'dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A',
  y: '36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA',
};

export const privateKeyJwk = {
  crv: 'secp256k1',
  d: 'rhYFsBPF9q3-uZThy7B3c4LDF_8wnozFUAEm5LLC4Zw',
  kid: 'JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw',
  kty: 'EC',
  x: 'dWCvM4fTdeM0KmloF57zxtBPXTOythHPMm1HCLrdd3A',
  y: '36uMVGM7hnw-N6GnjFcihWE3SkrhMLzzLCdPMXPEXlA',
};

export const publicKeyHex =
  '027560af3387d375e3342a6968179ef3c6d04f5d33b2b611cf326d4708badd7770';
export const privateKeyHex =
  'ae1605b013c5f6adfeb994e1cbb0777382c317ff309e8cc5500126e4b2c2e19c';

export const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MIGEAgEAMBAGByqGSM49AgEGBSuBBAAKBG0wawIBAQQgrhYFsBPF9q3+uZThy7B3
c4LDF/8wnozFUAEm5LLC4ZyhRANCAAR1YK8zh9N14zQqaWgXnvPG0E9dM7K2Ec8y
bUcIut13cN+rjFRjO4Z8Pjehp4xXIoVhN0pK4TC88ywnTzFzxF5Q
-----END PRIVATE KEY-----`;

export const publicKeyBase58 = 'jMpx6xhcVuAGmRLbGnX7XHh816pt254RUroNq9XGQbsD';
export const privateKeyBase58 = 'CiZR8L4nK73nhZNucoKvjN2zNRvNUbbYmZDqUABnHzB5';

export const seed =
  '9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017';

export const message = Buffer.from('hello');
export const signature =
  '82413762a7a77a39fb978b86a7386198999718bafd8768fa4976257a77f80646795bd6bfcc27d73c196b1083c3599ef7e77da36ac67c71b6a12a5f7879939e54';

export const didDocument = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    {
      '@base': 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
    },
  ],
  id: 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  publicKey: [
    {
      id: '#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
      publicKeyBase58: 'd5cW2R53NHTTkv7EQSYR8YxaKx7MVCcchjmK5EgCNXxo',
    },
  ],
  authentication: ['#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX'],
  assertionMethod: ['#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX'],
  capabilityDelegation: ['#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX'],
  capabilityInvocation: ['#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX'],
};

export const secp256k1_key_base58btc = {
  id: '#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  controller: 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  type: 'EcdsaSecp256k1VerificationKey2019',
  privateKeyBase58: 'BUJdPUYqcxzDgguYwbUnfQpHCSZM6dTsSwdwLqtdeKPk',
  publicKeyBase58: 'd5cW2R53NHTTkv7EQSYR8YxaKx7MVCcchjmK5EgCNXxo',
};

export const secp256k1_key_jwk = {
  id: '#zaS0k3zk2KpT4NqqpdUA1YD0JVTOtQf3pNoKDI-wes0',
  controller: 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  type: 'EcdsaSecp256k1VerificationKey2019',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'secp256k1',
    x: 'GBMxavme-AfIVDKqI6WBJ4V5wZItsxJ9muhxPByllHQ',
    y: 'SChlfVBhTXG_sRGc9ZdFeCYzI3Kbph3ivE12OFVk4jo',
    kid: 'zaS0k3zk2KpT4NqqpdUA1YD0JVTOtQf3pNoKDI-wes0',
  },
  privateKeyJwk: {
    kty: 'EC',
    crv: 'secp256k1',
    d: 'm5N7gTItgWz6udWjuqzJsqX-vksUnxJrNjD5OilScBc',
    x: 'GBMxavme-AfIVDKqI6WBJ4V5wZItsxJ9muhxPByllHQ',
    y: 'SChlfVBhTXG_sRGc9ZdFeCYzI3Kbph3ivE12OFVk4jo',
    kid: 'zaS0k3zk2KpT4NqqpdUA1YD0JVTOtQf3pNoKDI-wes0',
  },
};

export const secp256k1_key_hex = {
  id: '#key-0',
  controller: 'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX',
  type: 'EcdsaSecp256k1VerificationKey2019',
  publicKeyHex:
    '021813316af99ef807c85432aa23a581278579c1922db3127d9ae8713c1ca59474',
  privateKeyHex:
    '9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017',
};
