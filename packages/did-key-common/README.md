# did:key common

This module contains commont interfaces and factories for did:key.

```
npm i @transmute/did-key-common@latest --save
```

### Usage

```ts
import { Ed25519KeyPair } from '@transmute/ed25519-key-pair';
const resolve = getResolver(Ed25519KeyPair);
const { didDocument } = await resolve(did, {
  accept: 'application/did+json',
});
```
