import * as secp256k1 from '../index';

import { seed } from '../__fixtures__';

describe('e2e', () => {
  let key: secp256k1.Secp256k1KeyPair;
  let didDoc: any;
  let jws: string;
  let signature: any;

  it('key from seed', async () => {
    key = await secp256k1.Secp256k1KeyPair.generate({
      seed: Buffer.from(seed, 'hex'),
    });
    expect(key.id).toBe('#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX');
  });

  it('did doc from key', async () => {
    didDoc = await secp256k1.driver.keyToDidDoc(key);
    expect(didDoc.id).toBe(
      'did:key:zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX'
    );
    expect(didDoc.publicKey[0].id).toBe(
      '#zQ3shP2mWsZYWgvgM11nenXRTx9L1yiJKmkf9dfX7NaMKb1pX'
    );
  });

  it('can sign with key', async () => {
    const payload = Buffer.from('hello 123');
    const signer = key.signer();
    signature = await signer.sign({ data: payload });
    expect(signature).toBeDefined();
  });

  it('can verify with did doc', async () => {
    const payload = Buffer.from('hello 123');
    const _key = await secp256k1.Secp256k1KeyPair.from(didDoc.publicKey[0]);
    const verifier: any = _key.verifier();
    const verified = await verifier.verify({ data: payload, signature });
    expect(verified).toBe(true);
  });

  it('JWS sign and verify', async () => {
    let _jwk = await key.toJwk(true);
    const payload = { hello: 'world' };
    jws = await secp256k1.ES256K.sign(payload, _jwk, {
      kid: key.controller + key.id,
      alg: 'ES256K',
    });
    _jwk = await key.toJwk();
    let verified = await secp256k1.ES256K.verify(jws, _jwk);
    expect(verified).toEqual({ hello: 'world' });
  });

  it('resolve did doc from kid', async () => {
    const decoded = await secp256k1.ES256K.decode(jws, { complete: true });
    const _didDoc = await secp256k1.driver.get({
      did: decoded.header.kid,
    });
    expect(_didDoc).toEqual(didDoc);
  });

  it('can verify JWS from did doc', async () => {
    const _key = await secp256k1.Secp256k1KeyPair.from(didDoc.publicKey[0]);
    const _jwk = await _key.toJwk();
    const verified = await secp256k1.ES256K.verify(jws, _jwk);
    expect(verified).toEqual({ hello: 'world' });
  });
});
