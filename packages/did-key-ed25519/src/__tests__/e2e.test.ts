import * as ed25519 from '../index';
import * as fixtures from '../__fixtures__';

describe('e2e', () => {
  let key: ed25519.Ed25519KeyPair;
  let didDoc: any;
  let signature: any;
  let jws: string;

  it('key from seed', async () => {
    key = await ed25519.Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key.id).toBe(fixtures.ed25519_base58btc.id);
  });

  it('did doc from key', async () => {
    didDoc = await ed25519.driver.keyToDidDoc(key);
    expect(didDoc).toEqual(fixtures.didDocument);
  });

  it('can sign with key', async () => {
    const payload = Buffer.from('hello 123');
    const signer = key.signer();
    signature = await signer.sign({ data: payload });
    expect(signature).toBeDefined();
  });

  it('can verify with did doc', async () => {
    const payload = Buffer.from('hello 123');
    const _key = await ed25519.Ed25519KeyPair.from(didDoc.publicKey[0]);
    const verifier: any = _key.verifier();
    const verified = await verifier.verify({ data: payload, signature });
    expect(verified).toBe(true);
  });

  it('JWS sign and verify', async () => {
    let _jwk = await key.toJwk(true);
    const payload = { hello: 'world' };
    jws = await ed25519.EdDSA.sign(payload, _jwk, {
      kid: key.controller + key.id,
      alg: 'EdDSA',
    });
    _jwk = await key.toJwk();
    let verified = await ed25519.EdDSA.verify(jws, _jwk);
    expect(verified).toEqual({ hello: 'world' });
  });

  it('resolve did doc from kid', async () => {
    const decoded = await ed25519.EdDSA.decode(jws, { complete: true });
    const _didDoc = await ed25519.driver.get({
      did: decoded.header.kid,
    });
    expect(_didDoc).toEqual(didDoc);
  });

  it('can verify JWS from did doc', async () => {
    const _key = await ed25519.Ed25519KeyPair.from(didDoc.publicKey[0]);
    const _jwk = await _key.toJwk();
    const verified = await ed25519.EdDSA.verify(jws, _jwk);
    expect(verified).toEqual({ hello: 'world' });
  });
});
