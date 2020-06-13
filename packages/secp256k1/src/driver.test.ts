import { Secp256k1KeyPair } from './Secp256k1KeyPair';
import { seed, didDocument } from './__fixtures__';

import { keyToDidDoc, get } from './driver';

describe('driver', () => {
  describe('keyToDidDoc', () => {
    it('convert a secp256k1 key to a did document', async () => {
      let key: any = await Secp256k1KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      const _didDocument = keyToDidDoc(key);
      expect(_didDocument).toEqual(didDocument);
    });
  });

  describe('get', () => {
    it('resolve a key from id', async () => {
      let _didDocument: any = await get({
        did: didDocument.publicKey[0].id,
      });
      expect(_didDocument).toEqual(didDocument);
    });
  });
});
