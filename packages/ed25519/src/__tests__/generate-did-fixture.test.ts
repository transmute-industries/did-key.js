import fs from 'fs';
import path from 'path';
// import crypto from 'crypto';
import * as ed25519 from '../index';

const count = 5;
const WRITE_FIXTURE_TO_DISK = false;

it('generate random fixtures', async () => {
  let fixture: any = {};
  for (let i = 0; i < count; i++) {
    // const seed = crypto.randomBytes(32).toString('hex');
    const seed: any = `000000000000000000000000000000000000000000000000000000000000000${i}`;
    const key = await ed25519.Ed25519KeyPair.generate({
      secureRandom: () => {
        return Buffer.from(seed, 'hex');
      },
    });
    const didDocument = await ed25519.driver.get({
      did: key.controller,
    });
    fixture = {
      ...fixture,
      [didDocument.id]: {
        seed,
        verificationKeyPair: key.toKeyPair(true),
        keyAgreementKeyPair: key.toX25519KeyPair(true).toKeyPair(true),
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
