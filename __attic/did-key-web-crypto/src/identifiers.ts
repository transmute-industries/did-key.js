import * as web from '@transmute/web-crypto-key-pair';

const uvarintToJwkOpts: any = {
  '8024': { kty: 'EC', crv: 'P-256' },
  '8124': { kty: 'EC', crv: 'P-384' },
  '8224': { kty: 'EC', crv: 'P-521' },
};

export const bufferToJwkPub = (buf: Buffer) => {
  return {
    x: web.encoding.base64url.encode(buf.slice(0, buf.length / 2)),
    y: web.encoding.base64url.encode(buf.slice(buf.length / 2)),
  };
};

export const bufferToJwkPriv = (buf: Buffer) => {
  return {
    d: web.encoding.base64url.encode(buf),
  };
};

export const base58ToJwkPriv = (data: string) => {
  return bufferToJwkPriv(web.encoding.base58.decode(data));
};

export const wishForMultibase = (
  controller: string,
  privateKeyBase58: string
) => {
  const jwk = didToJwk(controller);
  return {
    ...jwk,
    ...base58ToJwkPriv(privateKeyBase58),
  };
};

export const getUvarintFromMulticodec = (multicodec: string) => {
  const decoded = web.encoding.base58.decode(multicodec);
  const uvarint = decoded.slice(0, 2).toString('hex');
  return uvarint;
};

export const getJwkOptsUvarint = (uvarint: string) => {
  return uvarintToJwkOpts[uvarint];
};

export const multicodecToJwk = (data: string) => {
  const encoding = data[0];
  if (encoding !== 'z') {
    throw new Error('only base58 encode (z) is supported');
  }
  const multicodec = data.slice(1);
  const decoded = web.encoding.base58.decode(multicodec);
  const uvarint = decoded.slice(0, 2).toString('hex');
  const pub = decoded.slice(2);

  return {
    ...getJwkOptsUvarint(uvarint),
    ...bufferToJwkPub(pub),
  };
};

export const didToJwk = (did: string) => {
  if (!did.startsWith('did:key:')) {
    throw new Error('did must start with "did:key:"');
  }
  return multicodecToJwk(did.slice(8));
};
