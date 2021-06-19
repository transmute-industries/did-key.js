import { DidDocumentRepresentation } from '../types';
import fixture from '../__fixtures__';

import { getResolver, getGenerator } from '../';

fixture.forEach((f: any) => {
  describe(f.name, () => {
    Object.keys(f.data).forEach(did => {
      const contentTypes = Object.keys(
        f.data[did]
      ) as DidDocumentRepresentation[];
      contentTypes.forEach(ct => {
        describe(ct, () => {
          it(`can resolve ${did}`, async () => {
            const resolve = getResolver(f.KeyPair);
            const { didDocument } = await resolve(did, {
              accept: ct,
            });
            // console.log(JSON.stringify(didDocument, null, 2));
            expect(didDocument).toEqual(f.data[did][ct]);
          });

          if (did.startsWith('did:key:z5Tc') || f.name !== 'bls12381') {
            it(`can generate ${f.name}`, async () => {
              const generate = getGenerator(f.KeyPair);
              const { keys, didDocument } = await generate(f.keyGenOptions, {
                accept: ct,
              });

              expect(keys.length).toBe(didDocument.verificationMethod.length);

              await Promise.all(
                keys.map(async k => {
                  const vmForK: any = didDocument.verificationMethod.find(
                    vm => {
                      return vm.id === k.id;
                    }
                  );
                  const kWithoutPrivateKey = JSON.parse(JSON.stringify(k));
                  delete kWithoutPrivateKey.privateKeyBase58;
                  delete kWithoutPrivateKey.privateKeyJwk;
                  expect(kWithoutPrivateKey).toEqual(vmForK);
                })
              );
            });
          }
        });
      });
    });
  });
});
