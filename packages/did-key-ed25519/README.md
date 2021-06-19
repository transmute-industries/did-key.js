# did-key-ed25519

```
npm i @transmute/did-key-ed25519@latest --save
```

## Usage

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

#### application/did+json

```json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
    "verificationMethod": [
      {
        "id": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
        "type": "JsonWebKey2020",
        "controller": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
        "publicKeyJwk": {
          "kty": "OKP",
          "crv": "Ed25519",
          "x": "MeAAEBREoZSt_ybeld8hp3ljqPLZVkhoqJNZhnLLRdo"
        }
      },
      {
        "id": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6LSp6Pn5t947LWnU2dXFQQjwhC6feHVxyPxh3rEayCA9uoh",
        "type": "JsonWebKey2020",
        "controller": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
        "publicKeyJwk": {
          "kty": "OKP",
          "crv": "X25519",
          "x": "uIBxujJZZ5KvxpKz_zufaFugLGvMh3hzrBM3WdxhAhQ"
        }
      }
    ],
    "assertionMethod": [
      "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3"
    ],
    "authentication": [
      "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3"
    ],
    "capabilityInvocation": [
      "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3"
    ],
    "capabilityDelegation": [
      "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3"
    ],
    "keyAgreement": [
      "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6LSp6Pn5t947LWnU2dXFQQjwhC6feHVxyPxh3rEayCA9uoh"
    ]
  },
  "keys": [
    {
      "id": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
      "type": "JsonWebKey2020",
      "controller": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "MeAAEBREoZSt_ybeld8hp3ljqPLZVkhoqJNZhnLLRdo"
      },
      "privateKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "MeAAEBREoZSt_ybeld8hp3ljqPLZVkhoqJNZhnLLRdo",
        "d": "sxsaVeX3OATiFFN0CZKcLuR-bUtLhqCuUosDeJj6zmcx4AAQFEShlK3_Jt6V3yGneWOo8tlWSGiok1mGcstF2g"
      }
    },
    {
      "id": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3#z6LSp6Pn5t947LWnU2dXFQQjwhC6feHVxyPxh3rEayCA9uoh",
      "type": "JsonWebKey2020",
      "controller": "did:key:z6Mkhox8UJXSDJkyBmHaCeTbdVkpXPFyyZ5pWPDdQpNsh5M3",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "uIBxujJZZ5KvxpKz_zufaFugLGvMh3hzrBM3WdxhAhQ"
      },
      "privateKeyJwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "uIBxujJZZ5KvxpKz_zufaFugLGvMh3hzrBM3WdxhAhQ",
        "d": "yITxYyx3U2n7zMUd3mZm1QTe2SO1kjsOT90CRmyTaEE"
      }
    }
  ]
}
```

#### application/did+ld+json

```json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/ed25519-2018/v1",
      "https://w3id.org/security/suites/x25519-2019/v1"
    ],
    "id": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
    "verificationMethod": [
      {
        "id": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
        "type": "Ed25519VerificationKey2018",
        "controller": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
        "publicKeyBase58": "4j3xffHp926Ed9hejDUsYEkoFNSEEMVPokkxonAGjNcx"
      },
      {
        "id": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6LSfqCz2nYXsitVeomJmsYNSz1gxJYbXjwi4icmSVEEHgNt",
        "type": "X25519KeyAgreementKey2019",
        "controller": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
        "publicKeyBase58": "5A2pWUjfnGAkZRPYFE2R8PoD7A1Uq8mZBju5x2ahaJc8"
      }
    ],
    "assertionMethod": [
      "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL"
    ],
    "authentication": [
      "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL"
    ],
    "capabilityInvocation": [
      "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL"
    ],
    "capabilityDelegation": [
      "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL"
    ],
    "keyAgreement": [
      "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6LSfqCz2nYXsitVeomJmsYNSz1gxJYbXjwi4icmSVEEHgNt"
    ]
  },
  "keys": [
    {
      "id": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
      "publicKeyBase58": "4j3xffHp926Ed9hejDUsYEkoFNSEEMVPokkxonAGjNcx",
      "privateKeyBase58": "3H9oCXsW18UfdgmpXsMyifH6vDDcCCeYZfNLqNgyDcVWpEPz6B1LkbLhXG4o1roUEqkCQDUZBwebVEAJzW9Kayep"
    },
    {
      "id": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL#z6LSfqCz2nYXsitVeomJmsYNSz1gxJYbXjwi4icmSVEEHgNt",
      "type": "X25519KeyAgreementKey2019",
      "controller": "did:key:z6MkiBK1FuYFUZahjeYMQnSiPLJo4wi5eEjkVmfte48HebQL",
      "publicKeyBase58": "5A2pWUjfnGAkZRPYFE2R8PoD7A1Uq8mZBju5x2ahaJc8",
      "privateKeyBase58": "F3h36Va6T1CzDVB1KT7AB5tb4e41tVZDvcFdKxTyebQ7"
    }
  ]
}
```

### Signatures

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
