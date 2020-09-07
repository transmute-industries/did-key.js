import bs58 from 'bs58';
import base64url from 'base64url';

export const jwkToBase58 = (jwk: any): string => {
  if (jwk.d) {
    return bs58.encode(Buffer.concat([base64url.toBuffer(jwk.d)]));
  }
  if (jwk.y) {
    return bs58.encode(
      Buffer.concat([base64url.toBuffer(jwk.x), base64url.toBuffer(jwk.y)])
    );
  }
  return bs58.encode(Buffer.concat([base64url.toBuffer(jwk.x)]));
};
