# did-key-secp256k1

```
npm i @transmute/did-key-secp256k1@latest --save
```

## Usage

### Generate

```ts
import crypto from 'crypto';
import * as secp256k1 from '@transmute/did-key-secp256k1';
const { didDocument, keys } = await secp256k1.generate(
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
import { Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
const k = await Secp256k1KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c',
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
import * as secp256k1 from '@transmute/did-key-secp256k1';
const {
  didDocument,
} = await secp256k1.resolve(
  'did:key:z6LScNhBGJJHGPgx9AMCHjxFew9qfbAZhsi1KyJYcfdcFQ9k',
  { accept: 'application/did+json' }
);
```

#### JsonWebSignature2020

This suite was created after `https://www.w3.org/2018/credentials/v1` so it must be added to the credential context.

```ts
import { ld as vcjs } from '@transmute/vc.js';
import { Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { JsonWebSignature, JsonWebKey } from '@transmute/json-web-signature';

const k = await Secp256k1KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
      'hex'
    );
  },
});

const suite = new JsonWebSignature({
  key: await JsonWebKey.from(
    await k.export({
      type: 'JsonWebSignature2020',
      privateKey: true,
    })
  ),
  date: '2020-03-10T04:24:12Z',
});

const vc = await vcjs.issue({
  credential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      // 🧙‍♂️ This extension context is required.
      'https://w3id.org/security/suites/jws-2020/v1',
    ],
    id: 'http://example.gov/credentials/3732',
    type: ['VerifiableCredential'],
    issuer: {
      id: k.controller,
    },
    issuanceDate: '2020-03-10T04:24:12.164Z',
    credentialSubject: {
      id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    },
  },
  suite,
  documentLoader,
});
```

### JOSE

#### ECDSA

```ts
import { Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { JWS } from '@transmute/jose-ld';

const k = await Secp256k1KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
      'hex'
    );
  },
});
const JWA_ALG = 'ES256K';
const signer = JWS.createSigner(k.signer('Ecdsa'), JWA_ALG);
const verifier = JWS.createVerifier(k.verifier('Ecdsa'), JWA_ALG);
const message = Uint8Array.from(Buffer.from('hello'));
const signature = await signer.sign({ data: message });
const verified = await verifier.verify({
  signature,
});
```

#### ECDH-ES+A256KW

```ts
import { Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { JWE } from '@transmute/jose-ld';

const k = await Secp256k1KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '9085d2bef69286a6cbb51623c8fa258629945cd55ca705cc4e66700396894e0c',
      'hex'
    );
  },
});
const cipher = new JWE.Cipher(Secp256k1KeyPair);
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
