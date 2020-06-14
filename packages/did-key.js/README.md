# @transmute/did-key.js

```
npm i @transmute/did-key.js@latest --save
```

## Import

```ts
import { resolver } from '@transmute/did-key.js';
```

## Resolve

```ts
const didDocument = await resolver.resolve(
  'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'
);
// {
//   '@context': [
//     'https://www.w3.org/ns/did/v1',
//     {
//       '@base': 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
//     },
//   ],
//   id: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
//   publicKey: [
//     {
//       id: '#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
//       type: 'Ed25519VerificationKey2018',
//       controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
//       publicKeyBase58: 'dbDmZLTWuEYYZNHFLKLoRkEX4sZykkSLNQLXvMUyMB1',
//     },
//   ],
//   authentication: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
//   assertionMethod: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
//   capabilityDelegation: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
//   capabilityInvocation: ['#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'],
//   keyAgreement: [
//     {
//       id: '#z6LScqmY9kirLuY22G6CuqBjuMpoqtgWk7bahWjuxFw5xH6G',
//       type: 'X25519KeyAgreementKey2019',
//       controller: 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP',
//       publicKeyBase58: '2AbNdSuzFSpGvsiSPBfnamcKzk9Q3WRRpY2EToHZEuKW',
//     },
//   ],
// };
```

# TODO

- More documentation.
