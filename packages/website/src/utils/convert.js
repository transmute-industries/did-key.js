import * as web from '@transmute/did-key-web-crypto';

import { resolve } from './resolve';

export const convert = async (keys, representation) => {
  // const other =
  //   representation === 'application/did+json'
  //     ? 'application/did+ld+json'
  //     : 'application/did+json';
  const { didDocument } = await resolve(keys[0].controller, representation);
  const converted = await Promise.all(
    keys.map(async (k) => {
      let k1 = await web.WebCryptoKey.from(k);
      let k2 = await k1.export({
        type: didDocument.verificationMethod[0].type,
        privateKey: true,
      });
      return k2;
    })
  );

  return { keys: converted, didDocument };
};
