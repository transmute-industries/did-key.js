import { startsWithMap } from './startsWithMap';

export const resolve = async (did, representation) => {
  const startsWith = did.substring(0, 12);
  if (!startsWithMap[startsWith]) {
    throw new Error('Unsupported startsWith: ' + startsWith);
  }
  return startsWithMap[startsWith].resolve(did, { accept: representation });
};
