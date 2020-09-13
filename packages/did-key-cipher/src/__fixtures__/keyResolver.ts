import { keypair } from './keypair.json';

export const keyResolver = ({ id }: any) => {
  let _kp: any = undefined;
  keypair.forEach(kp => {
    if (id.indexOf(kp.JsonWebKey2020.id) !== -1) {
      _kp = {
        ...kp.JsonWebKey2020,
        id: kp.JsonWebKey2020.controller + kp.JsonWebKey2020.id,
      };
    }
  });
  if (_kp) {
    return _kp;
  }
  throw new Error(`Key ${id} not found in fixtures`);
};
