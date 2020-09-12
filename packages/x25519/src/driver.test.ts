import { didDocument } from './__fixtures__/didDoc.json';
import { get } from './driver';

it('resolve a did', async () => {
  let _didDocument: any = await get({
    did:
      didDocument['did:key:z6LSeu9HkTHSfLLeUs2nnzUSNedgDUevfNQgQjQC23ZCit6F']
        .id,
  });
  expect(_didDocument).toEqual(
    didDocument['did:key:z6LSeu9HkTHSfLLeUs2nnzUSNedgDUevfNQgQjQC23ZCit6F']
  );
});
