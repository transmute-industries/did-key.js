import * as web from '@transmute/web-crypto-key-pair';

const uvarintToJwkOpts: any = {
  '8024': { kty: 'EC', crv: 'P-256' },
  '8124': { kty: 'EC', crv: 'P-384' },
  '8224': { kty: 'EC', crv: 'P-521' },
};

const multicodecToJwk = (data: string) => {
  const encoding = data[0];
  if (encoding !== 'z') {
    throw new Error('only base58 encode (z) is supported');
  }
  const multicodec = data.slice(1);
  const decoded = web.encoding.base58.decode(multicodec);
  const uvarint = decoded.slice(0, 2).toString('hex');
  const pub = decoded.slice(2);

  return {
    ...uvarintToJwkOpts[uvarint],
    x: web.encoding.base64url.encode(pub.slice(0, pub.length / 2)),
    y: web.encoding.base64url.encode(pub.slice(pub.length / 2)),
  };
};

export const didToJwk = (did: string) => {
  if (!did.startsWith('did:key:')) {
    throw new Error('did must start with "did:key:"');
  }
  return multicodecToJwk(did.slice(8));
};
