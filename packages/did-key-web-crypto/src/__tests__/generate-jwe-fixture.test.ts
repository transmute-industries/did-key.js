import fs from 'fs';
import path from 'path';

import {
  didCoreConformance,
  getKeyResolver,
} from '@transmute/did-key-test-vectors';
import { SUPPORTED_EC } from '../constants';

import { Cipher } from '@transmute/did-key-cipher';

import { KeyPair } from '../KeyPair';

const WRITE_FIXTURE_TO_DISK = false;
let fixtures: any = [];

const supported = SUPPORTED_EC.map(crvOrSize => {
  let kty = crvOrSize.indexOf('448') === -1 ? 'EC' : 'OKP';
  return { kty, crvOrSize };
});

let rep = {
  keyType: 'JsonWebKey2020',
  contentType: 'application/did+json',
};

supported.forEach(({ kty, crvOrSize }) => {
  it(`can generate jwe fixture for ${kty} / ${crvOrSize}`, async () => {
    const keyFixtures = didCoreConformance[crvOrSize.toLowerCase()].key;
    const keyResolver = getKeyResolver(
      didCoreConformance[crvOrSize.toLowerCase()].key,
      'application/did+json'
    );
    const cipher = new Cipher(KeyPair);
    const document = { key1: 'value1', key2: 'value2' };

    for (let i = 0; i < keyFixtures.length; i++) {
      const fixture = keyFixtures[i];
      const recipients = [
        {
          header: {
            kid:
              fixture.keypair['application/did+json'].controller +
              fixture.keypair['application/did+json'].id,
            alg: 'ECDH-ES+A256KW',
          },
        },
      ];
      const jwe = await cipher.encryptObject({
        obj: { ...document },
        recipients,
        keyResolver,
      });

      expect(jwe.protected).toBeDefined();
      const key = new KeyPair({
        ...fixture.keypair['application/did+json'],
        // required by AESKW integrity check
        id:
          fixture.keypair['application/did+json'].controller +
          fixture.keypair['application/did+json'].id,
      });

      const decryptedObject: any = await cipher.decryptObject({
        jwe,
        keyAgreementKey: key,
      });
      expect(decryptedObject).toEqual(document);
      fixtures.push({
        id:
          fixture.keypair['application/did+json'].controller +
          fixture.keypair['application/did+json'].id,
        ...rep,
        jwe,
      });
    }

    // uncomment to debug
    // console.log(JSON.stringify(fixtures, null, 2));
    if (WRITE_FIXTURE_TO_DISK) {
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `../__fixtures__/${crvOrSize.toLowerCase()}-jwe.json`
        ),
        JSON.stringify(fixtures, null, 2)
      );
    }
  });
});
