# did-key-x25519

```
npm i @transmute/did-key-x25519@latest --save
```

## Usage

### Generate

```ts
import crypto from 'crypto';
import * as x25519 from '@transmute/did-key-x25519';
const { didDocument, keys } = await x25519.generate(
  {
    secureRandom: () => {
      return crypto.randomBytes(32);
    },
  },
  { accept: 'application/did+json' }
);
```

### Export

```ts
import { X25519KeyPair } from '@transmute/did-key-x25519';
const k = await X25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
      'hex'
    );
  },
});
const exportedKeyPair = await k.export({
  type: 'JsonWebKey2020',
  privateKey: true,
});
```

### Resolve

```ts
import * as x25519 from '@transmute/did-key-x25519';
const {
  didDocument,
} = await x25519.resolve(
  'did:key:z6LScNhBGJJHGPgx9AMCHjxFew9qfbAZhsi1KyJYcfdcFQ9k',
  { accept: 'application/did+json' }
);
```

### JOSE

#### ECDH-ES+A256KW

```ts
import { X25519KeyPair } from '@transmute/did-key-x25519';
import { JWE } from '@transmute/jose-ld';

const k = await X25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '5a2b1f37ecc9fb7f27e1aa3daa4d66d9c3e54a4c0dcd53a4a5cacdfaf50578cb',
      'hex'
    );
  },
});
const cipher = new JWE.Cipher(X25519KeyPair);
const document = { key1: 'value1', key2: 'value2' };
const recipients = [
  {
    header: {
      kid: k.id,
      alg: 'ECDH-ES+A256KW',
    },
  },
];
const jwe = await cipher.encryptObject({
  obj: document,
  recipients,
  publicKeyResolver: async (id: string) => {
    if (id === k.id) {
      return k.export({ type: 'JsonWebKey2020' });
    }
    throw new Error(
      'publicKeyResolver does not suppport IRI ' + JSON.stringify(id)
    );
  },
});
const plaintext = await cipher.decrypt({ jwe, keyAgreementKey: k });
console.log(JSON.parse(Buffer.from(plaintext).toString('utf-8')));
```

## Representations

#### application/did+json

See [application/did+json](./src/__tests__/generate/__fixtures__/doc-0.json)

#### application/did+ld+json

See [application/did+ld+json](./src/__tests__/generate/__fixtures__/doc-0.ld.json)
