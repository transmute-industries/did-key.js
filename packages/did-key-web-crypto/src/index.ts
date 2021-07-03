import { getGenerator, getResolver } from '@transmute/did-key-common';
import { WebCryptoKey } from '@transmute/web-crypto-key-pair';

export { WebCryptoKey };
export const generate = getGenerator(WebCryptoKey);
export const resolve = getResolver(WebCryptoKey);
