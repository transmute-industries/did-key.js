# did-key-ed25519

```
npm i @transmute/did-key-ed25519@latest --save
```

## Usage

### Generate

```ts
import crypto from 'crypto';
import * as ed25519 from '@transmute/did-key-ed25519';
const { didDocument, keys } = await ed25519.generate(
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
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
const k = await Ed25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
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
import * as ed25519 from '@transmute/did-key-ed25519';
const {
  didDocument,
} = await ed25519.resolve(
  'did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3',
  { accept: 'application/did+json' }
);
```

### Verifiable Credentials

#### Ed25519Signature2018

This suite shipped in `https://www.w3.org/2018/credentials/v1` so no additional context is needed.

```ts
import { ld as vcjs } from '@transmute/vc.js';
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import {
  Ed25519Signature2018,
  Ed25519VerificationKey2018,
} from '@transmute/ed25519-signature-2018';

const k = await Ed25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
      'hex'
    );
  },
});

const suite = new Ed25519Signature2018({
  key: await Ed25519VerificationKey2018.from(
    await k.export({
      type: 'Ed25519VerificationKey2018',
      privateKey: true,
    })
  ),
  date: '2020-03-10T04:24:12Z',
});

const vc = await vcjs.issue({
  credential: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
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

#### JsonWebSignature2020

This suite was created after `https://www.w3.org/2018/credentials/v1` so it must be added to the credential context.

```ts
import { ld as vcjs } from '@transmute/vc.js';
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { JsonWebSignature, JsonWebKey } from '@transmute/json-web-signature';

const k = await Ed25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4f66b355aa7b0980ff901f2295b9c562ac3061be4df86703eb28c612faae6578',
      'hex'
    );
  },
});

const suite = new JsonWebSignature({
  key: await JsonWebKey.from(
    await k.export({
      type: 'Ed25519VerificationKey2018',
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

#### EdDSA

```ts
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { JWS } from '@transmute/jose-ld';

const k = await Ed25519KeyPair.generate({
  secureRandom: () => {
    return Buffer.from(
      '4e61bc1918ea6a47ae3307331be7798196a1a8e7cfe4b6e8f7c9a5f36017d929',
      'hex'
    );
  },
});
const JWA_ALG = 'EdDSA';
const signer = JWS.createSigner(k.signer('EdDsa'), JWA_ALG);
const verifier = JWS.createVerifier(k.verifier('EdDsa'), JWA_ALG);
const message = Uint8Array.from(Buffer.from('hello'));
const signature = await signer.sign({ data: message });
const verified = await verifier.verify({
  signature,
});
```

## Representations

#### application/did+json

See [application/did+json](./src/__tests__/generate/__fixtures__/doc-0.json)

#### application/did+ld+json

See [application/did+ld+json](./src/__tests__/generate/__fixtures__/doc-0.ld.json)
