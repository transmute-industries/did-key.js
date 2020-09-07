export const SUPPORTED_EC = ['P-256', 'P-384'];

// https://github.com/multiformats/multicodec/pull/190

export const crv_to_multicodec: any = {
  'P-256': [0x12, 0x00],
  'P-384': [0x12, 0x01],
  'P-521': [0x12, 0x02],
  Ed448: [0x12, 0x03],
  'X448:': [0x12, 0x04],
};
