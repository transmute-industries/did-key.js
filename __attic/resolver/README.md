# @transmute/did-key-resolver

DEPRECATED: DID Key should never be resolved over a network.

## Getting Started

```
npm run serve:local
```

### Resolve a DID

```
curl -s -X GET \
http://localhost:5010/api/dids/did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt \
| jq '.'
```

Yields

```
{
  "id": "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt",
  "@context": "https://w3id.org/did/v0.11",
  "publicKey": [
    {
      "id": "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt#z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt",
      "publicKeyBase58": "EN4A5YodqCe5ZJnWpS6xjms4mxAQkPzNUvPJ66fhhhdW"
    }
  ],
  "authentication": [
    "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt#z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt"
  ],
  "assertionMethod": [
    "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt#z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt"
  ],
  "capabilityDelegation": [
    "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt#z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt"
  ],
  "capabilityInvocation": [
    "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt#z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt"
  ],
  "keyAgreement": [
    {
      "id": "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt#z6LSejKqScAweCWaPSNBaB98vxdkRBuaQeoKe9osdivmZGv8",
      "type": "X25519KeyAgreementKey2019",
      "controller": "did:key:z6MkspKCfo45Ak8YfodDW14oasR4bXSGAHEjAwJDvNdicvQt",
      "publicKeyBase58": "449fvJN5YjnqJ3zR3XdBcNRGa3NTi3dAmB6C9GHEqu9N"
    }
  ]
}
```
