import * as did from '../index';

import examples from './examples.json';

const sample: any = examples;

Object.keys(sample).forEach((k) => {
  it(k, async () => {
    const r0 = await did.jwk.resolve(sample[k].didDocument.id);
    expect(r0.didDocument).toEqual(sample[k].didDocument);
  });
});
