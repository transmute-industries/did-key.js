import fs from 'fs';
import path from 'path';
import {
  didCoreConformance,
  getKeyResolver,
} from '@transmute/did-key-test-vectors';

import { Cipher } from '@transmute/did-key-cipher';

import { X25519KeyPair } from '../X25519KeyPair';

const cipher = new Cipher(X25519KeyPair);
const document = { key1: 'value1', key2: 'value2' };

const WRITE_FIXTURE_TO_DISK = false;
let fixtures: any = [];

let representations = [
  {
    keyType: 'JsonWebKey2020',
    contentType: 'application/did+json',
  },
  {
    keyType: 'X25519KeyAgreementKey2019',
    contentType: 'application/did+ld+json',
  },
];

const keyFixtures = didCoreConformance.x25519.key;

representations.forEach(rep => {
  describe(`Encryption Support for ${rep.contentType} / ${rep.keyType}`, () => {
    it(`can resolve keys`, async () => {
      for (let i = 0; i < keyFixtures.length; i++) {
        const fixture = keyFixtures[i];
        const fullUri =
          fixture.keypair[rep.contentType].controller +
          fixture.keypair[rep.contentType].id;
        const res1 = getKeyResolver(
          keyFixtures,
          rep.contentType
        )({ id: fullUri });
        expect(res1.type).toBe(rep.keyType);
      }
    });
    it(`can encrypt / decrypt `, async () => {
      for (let i = 0; i < keyFixtures.length; i++) {
        const fixture = keyFixtures[i];
        const recipients = [
          {
            header: {
              kid:
                fixture.keypair[rep.contentType].controller +
                fixture.keypair[rep.contentType].id,
              alg: 'ECDH-ES+A256KW',
            },
          },
        ];
        const keyResolver = getKeyResolver(keyFixtures, rep.contentType);
        const jwe = await cipher.encryptObject({
          obj: { ...document },
          recipients,
          keyResolver,
        });
        expect(jwe.protected).toBeDefined();
        const keyAgreementKey = new X25519KeyPair({
          ...fixture.keypair[rep.contentType],
          // required by AESKW integrity check
          id:
            fixture.keypair[rep.contentType].controller +
            fixture.keypair[rep.contentType].id,
        });
        const decryptedObject: any = await cipher.decryptObject({
          jwe,
          keyAgreementKey,
        });
        expect(decryptedObject).toEqual(document);
        fixtures.push({
          id: keyAgreementKey.id,
          ...rep,
          jwe,
        });
      }
    });
  });
});

it('can write fixtures to disk', () => {
  //   // uncomment to debug
  //   // console.log(JSON.stringify(fixture, null, 2));
  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/x25519-jwe.json'),
      JSON.stringify(fixtures, null, 2)
    );
  }
});
