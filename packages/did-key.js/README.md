# did-key.js

```
npm i @transmute/did-key.js@latest --save
```

This module contains all did-key implementations in this repository, exposed under namespaces.

```js
import * as did from 'transmute/did-key.js';

const { keys, didDocument } = await did.key.generate({
  type: 'Ed25519', // 'P-256', 'P-384', 'X25519', 'secp256k1'
  accept: 'application/did+json',
  secureRandom: () => {
    return Buffer.from(
      '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
      'hex'
    );
  },
});
// did:key:z6MkwfNFdM9vi8F5uZwFk87Nc5h4tvsjd...

const { keys, didDocument } = await did.jwk.generate({
  type: 'Ed25519', // 'P-256', 'P-384', 'X25519', 'secp256k1'
  accept: 'application/did+json',
});
// did:jwk:eyJrdHkiOiJFQyIsImNydiI6InNlY3AyN...

const { didDocument } = await did.jwk.resolve(
  'did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJYMjU1MTkiLCJ4Ijoid1VhYVM2RHd5YVAtOHZTX2FBTERmV3o2XzZRT2RkVUJBcV9MVjZMakFIOCJ9'
);
```
