import ES256K from './ES256K';

import { privateKeyJwk, publicKeyJwk } from './__fixtures__';

const payload = {
  hello: true,
};

describe('ES256K', () => {
  describe('sign', () => {
    it('should produce a ES256K', async () => {
      const signature = await ES256K.sign(payload, privateKeyJwk);
      expect(signature).toBe(
        'eyJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6dHJ1ZX0.NdmDdVLxgeu-IcmzrE4RsZpB-245i_7qu5nRxK6CUepunNiTuA33EG2jeqU1yaAPbMRgdwgShPZGmUNyYF4Rgg'
      );
    });
  });

  describe('verify', () => {
    it('should return the decoded payload for a valid ES256K', async () => {
      const jws =
        'eyJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6dHJ1ZX0.NdmDdVLxgeu-IcmzrE4RsZpB-245i_7qu5nRxK6CUepunNiTuA33EG2jeqU1yaAPbMRgdwgShPZGmUNyYF4Rgg';
      const verified = await ES256K.verify(jws, publicKeyJwk);
      expect(verified).toEqual(payload);
    });
  });

  describe('decode', () => {
    it('should return the decoded payload for a ES256K', async () => {
      const jws =
        'eyJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6dHJ1ZX0.NdmDdVLxgeu-IcmzrE4RsZpB-245i_7qu5nRxK6CUepunNiTuA33EG2jeqU1yaAPbMRgdwgShPZGmUNyYF4Rgg';
      const decoded = await ES256K.decode(jws);
      expect(decoded).toEqual(payload);
    });

    it('should return the decoded complete payload for a ES256K', async () => {
      const jws =
        'eyJhbGciOiJFUzI1NksifQ.eyJoZWxsbyI6dHJ1ZX0.NdmDdVLxgeu-IcmzrE4RsZpB-245i_7qu5nRxK6CUepunNiTuA33EG2jeqU1yaAPbMRgdwgShPZGmUNyYF4Rgg';
      const decoded = await ES256K.decode(jws, { complete: true });
      expect(decoded.payload).toEqual(payload);
      expect(decoded.header).toEqual({ alg: 'ES256K' });
      expect(decoded.signature).toBe(
        'NdmDdVLxgeu-IcmzrE4RsZpB-245i_7qu5nRxK6CUepunNiTuA33EG2jeqU1yaAPbMRgdwgShPZGmUNyYF4Rgg'
      );
    });
  });
});
