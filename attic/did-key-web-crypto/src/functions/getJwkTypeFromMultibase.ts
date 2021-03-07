import bs58 from 'bs58';
import { multicodecToJwkType } from '../constants';
export const getJwkTypeFromMultibase = (fingerprint: string) => {
  const buffer = bs58.decode(fingerprint.substring(1));

  if (buffer[0] !== 0x12) {
    throw new Error(`Unsupported multibase ${buffer[0].toString(16)}`);
  }

  const type = multicodecToJwkType[buffer[1]];
  if (!type) {
    throw new Error(
      `Unsupported multibase ${buffer[0].toString(16)} ${buffer[1].toString(
        16
      )}`
    );
  }
  return type;
};
