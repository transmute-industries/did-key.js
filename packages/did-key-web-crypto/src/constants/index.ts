export const SUPPORTED_EC = ['P-256', 'P-384'];

// https://github.com/multiformats/multicodec/pull/190

export const multicodecPrefix = 0x12;

export const crvToMulticodecPrefix: any = {
  'P-256': 0x00,
  'P-384': 0x01,
  'P-521': 0x02,
  Ed448: 0x03,
  X448: 0x04,
};

export const multicodecToJwkType: any = {
  0x00: { kty: 'EC', crv: 'P-256' },
  0x01: { kty: 'EC', crv: 'P-384' },
  0x02: { kty: 'EC', crv: 'P-521' },
  0x03: { kty: 'OKP', crv: 'Ed448' },
  0x04: { kty: 'OKP', crv: 'X448' },
};
