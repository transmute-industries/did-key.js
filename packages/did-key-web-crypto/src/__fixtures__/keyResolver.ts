import { keypair } from './keypair.json';

export const keyResolver = ({ id }: any) => {
  let _kp: any = undefined;
  keypair.forEach(kp => {
    if (id.indexOf(kp.toJwkPair.id) !== -1) {
      _kp = {
        ...kp.toJwkPair,
        id: kp.toJwkPair.controller + kp.toJwkPair.id,
      };
    }
  });
  if (_kp) {
    return _kp;
  }
  throw new Error(`Key ${id} not found in fixtures`);
};
