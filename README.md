<p align="center">
  <img src="./transmute-banner.png"/>
</p>

### [DID Key Method Specification](https://github.com/w3c-ccg/did-method-key)

`did:key` is a [DID Method](https://w3c.github.io/did-core/) which is offline friendly, cryptographically self certifying, requires no trust of blockchain or certificate authoritites and is ideal for ephemeral use.

🚧 Under Construction.

#### [did-key.js](./packages/did-key.js)

![CI](https://github.com/transmute-industries/did-key.js/workflows/CI/badge.svg)

```
npm i @transmute/did-key.js@latest --save
```

#### [Ed25519](./packages/ed25519)

![ed25519](https://github.com/transmute-industries/did-key.js/workflows/ed25519/badge.svg)

`did:key:z6Mk...`

```
npm i @transmute/did-key-ed25519@latest --save
```

#### [X25519](./packages/x25519)

![x25519](https://github.com/transmute-industries/did-key.js/workflows/x25519/badge.svg)

`did:key:z6LS...`

```
npm i @transmute/did-key-x25519@latest --save
```

#### [Bls12381](./packages/bls12381)

![bls12381](https://github.com/transmute-industries/did-key.js/workflows/bls12381/badge.svg)

`did:key:zUC7...`

```
npm i @transmute/did-key-bls12381@latest --save
```

#### [Secp256k1](./packages/secp256k1)

![secp256k1](https://github.com/transmute-industries/did-key.js/workflows/secp256k1/badge.svg)

`did:key:zQ3s...`

```
npm i @transmute/did-key-secp256k1@latest --save
```

### Alternatives

- [digitalbazaar/did-method-key-js](https://github.com/digitalbazaar/did-method-key-js)
- [digitalbazaar/crypto-ld](https://github.com/digitalbazaar/crypto-ld)
- [mattrglobal/bls12381-key-pair](https://github.com/mattrglobal/bls12381-key-pair)

### License

```
Copyright 2020 Transmute Industries Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
