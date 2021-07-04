import crypto from 'crypto';

export const getSeed = () => {
  return crypto.randomBytes(32).toString('hex');
};
