const keypair = require('./x25519-keypair.json').keypair;

const keyResolver = ({ id }) => {
  let _kp = undefined;
  keypair.forEach((kp) => {
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

module.exports = { keyResolver };
