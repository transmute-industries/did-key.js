import { KeyPair } from './index';

it('generate', async () => {
  const kp: any = await KeyPair.generate();
  expect(kp.publicKey.algorithm.namedCurve).toBe('P-384');
  expect(kp.privateKey.algorithm.namedCurve).toBe('P-384');
});

it('from', async () => {
  const kp: any = await KeyPair.from({
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
      y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
      y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
      d: 'Wq5_KgqjvYh_EGvBDYtSs_0ufJJP0y0tkAXl6GqxHMkY0QP8vmD76mniXD-BWhd_',
    },
  });
  expect(kp.publicKey.algorithm.namedCurve).toBe('P-384');
  expect(kp.privateKey.algorithm.namedCurve).toBe('P-384');
});

it('from base58', async () => {
  const start: any = {
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
      y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'dMtj6RjwQK4G5HP3iwOD94RwbzPhS4wTZHO1luk_0Wz89chqV6uJyb51KaZzK0tk',
      y: 'viPKF7Zbc4FxKegoupyVRcBr8TZHFxUrKQq4huOAyMuhTYJbFpAwMhIrWppql02E',
      d: 'Wq5_KgqjvYh_EGvBDYtSs_0ufJJP0y0tkAXl6GqxHMkY0QP8vmD76mniXD-BWhd_',
    },
  };
  const kp = await KeyPair.from(start);
  const ldkp = await kp.toKeyPair(true);
  const kpfromld = await KeyPair.from(ldkp);
  const kp2fromld = await kpfromld.toJsonWebKeyPair(true);
  expect(kp2fromld).toEqual({
    ...start,
    controller:
      'did:key:zFwfU3dCN5eiJncUqQ42wt7MjWWdBsoctDosQM9cwBqb1bYuTzFsnQPwYGHuyNDx7BJUpzvsZAVFH2M1tdN7UMiFsYsq88BdiYxsAV2RiUinBGoyAcNwDFZyeAkfdrmyrqDPUwD',
    id:
      '#zFwfU3dCN5eiJncUqQ42wt7MjWWdBsoctDosQM9cwBqb1bYuTzFsnQPwYGHuyNDx7BJUpzvsZAVFH2M1tdN7UMiFsYsq88BdiYxsAV2RiUinBGoyAcNwDFZyeAkfdrmyrqDPUwD',
  });
});

it('fingerprint', async () => {
  const kp: any = await KeyPair.from({
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
      d: 'Xe1HHeh-UsrJPRNLR_Y06VTrWpZYBXi7a7kiRqCgwnAOlJZPwE-xzL3DIIVMavAL',
    },
  });
  const fingerprint = await kp.fingerprint();
  expect(fingerprint).toBe(
    'zFwepbBSaPFjt5T1zWptHaXugLNxHYABfJrDoAZRYxKjNkpdfrniF3pvYQAXwxVB7afhmsgzYtSCzTVZQ3F5SPHzP5PuHgtBGNYucZTSrnA7yTTDr7WGQZaTTkJWfiH47jW5ahU'
  );
});

it('toJsonWebKeyPair', async () => {
  const kp: any = await KeyPair.from({
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
      d: 'Xe1HHeh-UsrJPRNLR_Y06VTrWpZYBXi7a7kiRqCgwnAOlJZPwE-xzL3DIIVMavAL',
    },
  });
  const kp2 = await kp.toJsonWebKeyPair(true);
  expect(kp2).toEqual({
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
      d: 'Xe1HHeh-UsrJPRNLR_Y06VTrWpZYBXi7a7kiRqCgwnAOlJZPwE-xzL3DIIVMavAL',
    },
  });
});

it('fromFingerprint', async () => {
  const kp: any = await KeyPair.fromFingerprint({
    fingerprint:
      'zFwepbBSaPFjt5T1zWptHaXugLNxHYABfJrDoAZRYxKjNkpdfrniF3pvYQAXwxVB7afhmsgzYtSCzTVZQ3F5SPHzP5PuHgtBGNYucZTSrnA7yTTDr7WGQZaTTkJWfiH47jW5ahU',
  });
  const kp2 = await kp.toJsonWebKeyPair();
  expect(kp2).toEqual({
    id:
      '#zFwepbBSaPFjt5T1zWptHaXugLNxHYABfJrDoAZRYxKjNkpdfrniF3pvYQAXwxVB7afhmsgzYtSCzTVZQ3F5SPHzP5PuHgtBGNYucZTSrnA7yTTDr7WGQZaTTkJWfiH47jW5ahU',
    type: 'JsonWebKey2020',
    controller:
      'did:key:zFwepbBSaPFjt5T1zWptHaXugLNxHYABfJrDoAZRYxKjNkpdfrniF3pvYQAXwxVB7afhmsgzYtSCzTVZQ3F5SPHzP5PuHgtBGNYucZTSrnA7yTTDr7WGQZaTTkJWfiH47jW5ahU',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
    },
  });
});

// base58 not really supported for nist curves...
// will support multibase when private keys are defined for it.
it('toKeyPair', async () => {
  const kp: any = await KeyPair.from({
    id: 'did:example:123#key',
    type: 'JsonWebKey2020',
    controller: 'did:example:123',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
    },
    privateKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: 'CA-iNoHDg1lL8pvX3d1uvExzVfCz7Rn6tW781Ub8K5MrDf2IMPyL0RTDiaLHC1JT',
      y: 'Kpnrn8DkXUD3ge4mFxi-DKr0DYO2KuJdwNBrhzLRtfMa3WFMZBiPKUPfJj8dYNl_',
      d: 'Xe1HHeh-UsrJPRNLR_Y06VTrWpZYBXi7a7kiRqCgwnAOlJZPwE-xzL3DIIVMavAL',
    },
  });
  const kp2 = await kp.toKeyPair(true);
  expect(kp2.privateKeyBase58).toBe(
    '4SqZmqamZpPRgoLcMBx5RK32XZC6BH874emLVnpzocrtJ52q4NcNkJdfkTtxkrcysp'
  );
});
