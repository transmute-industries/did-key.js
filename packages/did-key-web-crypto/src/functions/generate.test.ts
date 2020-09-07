import { SUPPORTED_EC } from '../constants';
import { generate } from './generate';

const supported = SUPPORTED_EC.map(crvOrSize => {
  return { kty: 'EC', crvOrSize };
});

supported.forEach(supported => {
  it(`${supported.kty} ${supported.crvOrSize} `, async () => {
    const key = await generate(supported);
    expect(key.publicKeyJwk).toBeDefined();
    expect(key.privateKeyJwk).toBeDefined();
  });
});
