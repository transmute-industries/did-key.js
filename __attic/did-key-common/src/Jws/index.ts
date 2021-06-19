import base64url from 'base64url';
import canonicalize from 'canonicalize';

export const createJws = async (signer: any, payload: any, header: object) => {
  const encodedHeader = base64url.encode(canonicalize(header));
  const encodedPayload = base64url.encode(canonicalize(payload));
  const toBeSigned = `${encodedHeader}.${encodedPayload}`;
  const signature = await signer.sign(Buffer.from(toBeSigned));
  return `${toBeSigned}.${base64url.encode(Buffer.from(signature))}`;
};

export const verifyJws = async (verifier: any, jws: string) => {
  const [header, payload, signature] = jws.split('.');
  const toBeVerified = `${header}.${payload}`;
  const verified = await verifier.verify(
    Buffer.from(toBeVerified),
    base64url.toBuffer(signature)
  );

  return verified;
};

export const createDetachedJws = async (
  signer: any,
  payload: Buffer,
  header: object
) => {
  const encodedHeader = base64url.encode(
    canonicalize({ ...header, b64: false, crit: ['b64'] })
  );

  const toBeSigned = new Uint8Array(
    Buffer.concat([
      Buffer.from(encodedHeader, 'utf-8'),
      Buffer.from('.', 'utf-8'),
      payload,
    ])
  );
  const signature = await signer.sign(Buffer.from(toBeSigned));
  const encodedSignature = base64url.encode(Buffer.from(signature));
  return `${encodedHeader}..${encodedSignature}`;
};

export const verifyDetachedJws = async (
  verifier: any,
  payload: Buffer,
  signature: string
) => {
  const [encodedHeader, encodedSignature] = signature.split('..');

  const toBeVerified = new Uint8Array(
    Buffer.concat([
      Buffer.from(encodedHeader, 'utf-8'),
      Buffer.from('.', 'utf-8'),
      payload,
    ])
  );

  const verified = await verifier.verify(
    Buffer.from(toBeVerified),
    base64url.toBuffer(encodedSignature)
  );

  return verified;
};
