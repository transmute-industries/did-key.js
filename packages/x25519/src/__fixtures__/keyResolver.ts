import { keypair } from './keypair.json';

export const keyResolver = ({ id }: any) => {
  let _kp: any = undefined;
  keypair.forEach((kp: any) => {
    if (id.indexOf(kp.X25519KeyAgreementKey2019.id) !== -1) {
      _kp = {
        ...kp.X25519KeyAgreementKey2019,
        id:
          kp.X25519KeyAgreementKey2019.controller +
          kp.X25519KeyAgreementKey2019.id,
      };
    }
  });
  if (_kp) {
    return _kp;
  }
  throw new Error(`Key ${id} not found in fixtures`);
};
