# @transmute/did-key-p384

![p384](https://github.com/transmute-industries/did-key.js/workflows/p384/badge.svg)

```
npm i @transmute/did-key-p384@latest --save
```

## Usage

```ts
import { P384KeyPair } from '@transmute/did-key-p384';
const key = await P384KeyPair.generate();
const key = await P384KeyPair.from({
  privateKeyJwk: fixtures.privateKeyJwk,
});
const signer = key.signer();
const signature = await signer.sign({ data: fixtures.message });
const verifier = key.verifier();
const verified = await verifier.verify({ data: fixtures.message, signature });
expect(verified).toBe(true);
const secret = await key.deriveSecret({ publicKey });
// expect secret to be equivalent to web crypto deriveBits.
```

# TODO

- More documentation.
