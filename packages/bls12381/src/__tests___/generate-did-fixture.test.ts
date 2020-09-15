import fs from 'fs';
import path from 'path';
// import crypto from 'crypto';
import * as bls12381 from '../index';

const count = 5;
const WRITE_FIXTURE_TO_DISK = false;

it('generate random fixtures', async () => {
  let fixture: any = {};
  for (let i = 0; i < count; i++) {
    const key = await bls12381.Bls12381G2KeyPair.generate();

    const didDocument = await bls12381.driver.keyToDidDoc(key);
    fixture = {
      ...fixture,
      [didDocument.id]: {
        verificationKeyPair: bls12381.Bls12381G2KeyPair.toKeyPair(key),
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
