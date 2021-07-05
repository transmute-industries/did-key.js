# did-key-web-crypto

```
npm i @transmute/did-key-web-crypto@latest --save
```

## Usage

### Generate

```ts
import crypto from 'crypto';
import * as x25519 from '@transmute/did-key-web-crypto';
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
import { X25519KeyPair } from '@transmute/did-key-web-crypto';
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
import * as x25519 from '@transmute/did-key-web-crypto';
const {
  didDocument,
} = await x25519.resolve(
  'did:key:z82Lko9khHxoBWbrLghrAvXECFzU1raPvff9ahT4osfYpNCCkY973EoR85FMyxvQCPbLfeK',
  { accept: 'application/did+json' }
);
```

#### JsonWebSignature2020

This suite was created after `https://www.w3.org/2018/credentials/v1` so it must be added to the credential context.

```ts
import * as web from '@transmute/did-key-web-crypto';
import { ld as vcjs } from '@transmute/vc.js';
import { JsonWebSignature, JsonWebKey } from '@transmute/json-web-signature';

const k = await web.WebCryptoKey.generate({
  kty: 'EC',
  crvOrSize: 'P-384',
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

const vp = await vcjs.signPresentation({
  presentation: {
    '@context': vc['@context'],
    type: ['VerifiablePresentation'],
    holder: key.controller,
    verifiableCredential: [vc],
  },
  challenge: '123',
  suite,
  documentLoader,
});

const verification = await vcjs.verify({
  presentation: verifiablePresentation,
  challenge: '123',
  suite: new JsonWebSignature(),
  documentLoader: async (iri: string) => {
    if (iri.startsWith('did:key')) {
      const { didDocument } = await web.resolve(iri, {
        accept: 'application/did+json',
      });
      return {
        document: didDocument,
      };
    }
    return documentLoader(iri);
  },
});
```

### JOSE

#### ES384

```ts
import * as web from '@transmute/did-key-web-crypto';
import { JWS } from '@transmute/jose-ld';

const k = await web.WebCryptoKey.generate({
  kty: 'EC',
  crvOrSize: 'P-384',
});

const JWA_ALG = 'ES384';

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
import * as web from '@transmute/did-key-web-crypto';
import { JWE } from '@transmute/jose-ld';

const k = await web.WebCryptoKey.generate({
  kty: 'EC',
  crvOrSize: 'P-384',
});
const cipher = new JWE.Cipher(web.WebCryptoKey);
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

See [application/did+json](./src/__tests__/generate/__fixtures__/all.json)

#### application/did+ld+json

See [application/did+ld+json](./src/__tests__/generate/__fixtures__/all.json)
