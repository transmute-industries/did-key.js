<p align="center">
  <img src="./transmute-banner.png"/>
</p>

### [DID Key Method Specification](https://github.com/w3c-ccg/did-method-key)

`did:key` is a [DID Method](https://w3c.github.io/did-core/) which is offline friendly, cryptographically self certifying, requires no trust of blockchain or certificate authoritites and is ideal for ephemeral use.

🚧 Under Construction.

Demos:

- Web App: [https://key.did.ai](https://key.did.ai).
- Web API: [`did:key:z6MkndnfMMECHMNK11dGgkXJ1N1PweGhU5mTVJMcSWR7GXoo`](https://key.did.ai/did/did:key:z6MkndnfMMECHMNK11dGgkXJ1N1PweGhU5mTVJMcSWR7GXoo).

#### [did-key.js](./packages/did-key.js)

![CI](https://github.com/transmute-industries/did-key.js/workflows/CI/badge.svg)

If you want to resolve all did keys, you need to install all of them:

```
npm i @transmute/did-key.js@latest @transmute/did-key-ed25519@latest @transmute/did-key-x25519@latest @transmute/did-key-bls12381@latest @transmute/did-key-secp256k1@latest @transmute/did-key-p384@latest --save
```

Use the imports below if you only want to support 1 did key type.

#### [Ed25519](./packages/ed25519)

`did:key:z6Mk...`

```
npm i @transmute/did-key-ed25519@latest --save
```

#### [X25519](./packages/x25519)

`did:key:z6LS...`

```
npm i @transmute/did-key-x25519@latest --save
```

#### [Bls12381](./packages/bls12381)

`did:key:zUC7...`

```
npm i @transmute/did-key-bls12381@latest --save
```

#### [Secp256k1](./packages/secp256k1)

`did:key:zQ3s...`

```
npm i @transmute/did-key-secp256k1@latest --save
```

#### [P-384](./packages/p384)

`did:key:zUew...`

```
npm i @transmute/did-key-p384@latest --save
```

### Alternatives

- [digitalbazaar/did-method-key-js](https://github.com/digitalbazaar/did-method-key-js)
- [digitalbazaar/crypto-ld](https://github.com/digitalbazaar/crypto-ld)
- [mattrglobal/bls12381-key-pair](https://github.com/mattrglobal/bls12381-key-pair)

## Release process

### Unstable releases

Unstable releases are automatic, from CD:

- On every commit to master an unstable release is pushed. An unstable release is a release with a tag of the form: vA.B.C-unstable.X. Everytime a PR is merged, X is incremented.
- If "skip-ci" is present in the commit message, the aforementioned behavior is skipped

### Stable releases

Stable releases are triggered by a dev locally

- Make sure you are familiar with [Semantic Versioning](https://semver.org/)
- Run `npm install` and `npm build` in the root level directory
- Run
  - `npm run publish:stable:patch` for a patch version increment
  - `npm run publish:stable:minor` for a minor version increment
  - `npm run publish:stable:major` for a major version increment

### Example

- Current version is v0.1.0
- A PR is made to fix bug A. When it's merged a release is made: v0.1.0-unstable-0
- A PR is made to add feature B. When it's merged a release is made: v0.1.0-unstable-1
- A PR is made to add feature C. When it's merged a release is made: v0.1.0-unstable-2
- Dev runs `npm run publish:stable:patch`. Current version is v0.1.0
- A PR is made to fix bug D. When it's merged a release is made: v0.1.1-unstable-0
- etc...

### Deployment

```
npm run deploy
```

Because `did:key` is just a deterministic transformer of public key bytes...

You really ought to never resolve it over a network.

However, it can be useful for testing purposes.

In order to avoid costs, recommend a hosting provider that is free / rate limited.

glitch.com is one such provider... firebase used to be 😢

#####

1.  Create a new glitch.com project.
2.  Allow git pushes for the project.

Tools > Terminal

```
git config receive.denyCurrentBranch updateInstead
```

3. Get the project git url

Tools > Import & Export > Project_Git_URL

4. Set the project as a submodule

```
git submodule add <Project_Git_URL> glitch-hosting
```

5. Make some changes and push

6. Refresh glitch project to see changes.

Tools > Terminal

```
refresh
```

7. Setup npm scripts to automate deployments according to your preferences.

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
