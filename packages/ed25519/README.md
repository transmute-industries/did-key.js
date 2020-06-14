# @transmute/did-key-ed25519

![ed25519](https://github.com/transmute-industries/did-key.js/workflows/ed25519/badge.svg)

```
npm i @transmute/did-key-ed25519@latest --save
```

## Import

```ts
import * as ed25519 from '@transmute/did-key-ed25519';
```

## Generate

```ts
const key = await ed25519.Ed25519KeyPair.generate({
  seed: Buffer.from(
    '9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017',
    'hex'
  ),
});
// or
// import crypto from 'crypto';
// const key = await ed25519.Ed25519KeyPair.generate({
//   secureRandom: () => {
//     return crypto.randomBytes(32);
//   },
// });
```

# TODO

- More documentation.
