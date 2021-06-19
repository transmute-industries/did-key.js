import { EncryptTransformer } from './EncryptTransformer';

it('can construct', () => {
  const et = new EncryptTransformer({});
  expect(et.index).toBe(0);
});
