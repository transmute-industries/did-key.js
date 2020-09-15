import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bs58 from 'bs58';
import * as secp256k1 from '../index';

const count = 5;
const WRITE_FIXTURE_TO_DISK = false;

it('generate random fixtures', async () => {
  let fixture: any = {};
  for (let i = 0; i < count; i++) {
    const key = await secp256k1.Secp256k1KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });

    const didDocument = await secp256k1.driver.get({
      did: key.controller,
    });
    fixture = {
      ...fixture,
      [didDocument.id]: {
        seed: bs58.decode(key.privateKeyBase58).toString('hex'),
        verificationKeyPair: key.toKeyPair(true),
        didDocument,
      },
    };
  }

  //   uncomment to debug
  //   console.log(JSON.stringify(fixture, null, 2));

  if (WRITE_FIXTURE_TO_DISK) {
    fs.writeFileSync(
      path.resolve(__dirname, '../__fixtures__/did.json'),
      JSON.stringify(fixture, null, 2)
    );
  }
});
