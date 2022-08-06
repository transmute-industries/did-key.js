# did-key.js

```
npm i @transmute/did-key.js@latest --save
```

This module contains all did-key implementations in this repository, exposed under namespaces.

```ts
import * as did from 'transmute/did-key.js';
```

## did:jwk

You can also use this library to support did:jwk.

```ts
import did from '@transmute/did-key.js';

const { keys, didDocument } = await did.jwk.generate({
  type: 'Ed25519', // 'P-256', 'P-384', 'X25519', 'secp256k1'
  method: 'jwk',
  accept: 'application/did+json',
});
```
