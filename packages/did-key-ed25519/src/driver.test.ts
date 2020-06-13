import { Ed25519KeyPair } from './Ed25519KeyPair';
import { seed, didDocument } from './__fixtures__';

import {
  keyToDidDoc,
  get
} from './driver';

describe('driver', () => {
  describe('keyToDidDoc', () => {
    it('convert a secp256k1 key to a did document', async () => {
      let key: any = await Ed25519KeyPair.generate({
        seed: Buffer.from(seed, 'hex'),
      });
      const _didDocument = keyToDidDoc(key);
      expect(_didDocument).toEqual(didDocument);
    });
  });

    describe('get', () => {
      it('resolve a key from id', async () => {
        let _didDocument: any = await get({
          did: didDocument.id,
        });
        expect(_didDocument).toEqual(didDocument);
      });
    });
});
