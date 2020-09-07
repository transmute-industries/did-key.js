import { SUPPORTED_EC } from '../constants';
import { Crypto } from 'node-webcrypto-ossl';

const crypto = new Crypto();

export interface GenerateOptions {
  kty: string;
  crvOrSize: string;
}

export const generate = async (options: GenerateOptions) => {
  if (options.kty === 'EC' && SUPPORTED_EC.indexOf(options.crvOrSize) !== -1) {
    let kp = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: options.crvOrSize,
      },
      true,
      ['sign', 'verify']
    );
    const jwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
    return {
      publicKeyJwk: {
        kty: jwk.kty,
        crv: jwk.crv,
        x: jwk.x,
        y: jwk.y,
      },
      privateKeyJwk: {
        kty: jwk.kty,
        crv: jwk.crv,
        x: jwk.x,
        y: jwk.y,
        d: jwk.d,
      },
    };
  }

  throw new Error(
    `Generate does not support ${options.kty} and ${options.crvOrSize}`
  );
};
