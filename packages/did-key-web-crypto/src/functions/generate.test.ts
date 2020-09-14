import { SUPPORTED_EC } from '../constants';
import { generate } from './generate';

const supported = SUPPORTED_EC.map(crvOrSize => {
  let kty = crvOrSize.indexOf('448') === -1 ? 'EC' : 'OKP';
  return { kty, crvOrSize };
});

supported.forEach(supported => {
  it(`${supported.kty} ${supported.crvOrSize} `, async () => {
    const key = await generate(supported);
    expect(key.publicKeyJwk).toBeDefined();
    expect(key.privateKeyJwk).toBeDefined();
  });
});
