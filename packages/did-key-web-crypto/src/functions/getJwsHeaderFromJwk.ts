import { crvToJwsAlg } from '../constants';

import { fromJwk } from './fromJwk';
export const getJwsHeaderFromJwk = (publicKeyJwk: any) => {
  const kp = fromJwk(publicKeyJwk);
  const header = {
    // sad JWS inflation
    // this is much more valuable when:
    // `kid ! ~= publicKeyBytes ...
    kid: `${kp.controller}${kp.id}`,
    alg: crvToJwsAlg[publicKeyJwk.crv],
  };
  return header;
};
