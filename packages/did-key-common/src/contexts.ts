import * as dc from '@transmute/did-context';
import * as sc from '@transmute/security-context';

export const contexts: any = {
  [dc.constants.DID_CONTEXT_V1_URL]: dc.contexts.get(
    dc.constants.DID_CONTEXT_V1_URL
  ),
  [sc.constants.JSON_WEB_SIGNATURE_2020_V1_URL]: sc.contexts.get(
    sc.constants.JSON_WEB_SIGNATURE_2020_V1_URL
  ),
  [sc.constants.ED25519_2018_v1_URL]: sc.contexts.get(
    sc.constants.ED25519_2018_v1_URL
  ),
  [sc.constants.X25519_2019_v1_URL]: sc.contexts.get(
    sc.constants.X25519_2019_v1_URL
  ),
  [sc.constants.BLS12381_2020_V1_URL]: sc.contexts.get(
    sc.constants.BLS12381_2020_V1_URL
  ),
  [sc.constants.MULTIKEY_2021_V1_URL]: sc.contexts.get(
    sc.constants.MULTIKEY_2021_V1_URL
  ),
  [sc.constants.SECP256k1_2019_v1_URL]: sc.contexts.get(
    sc.constants.SECP256k1_2019_v1_URL
  ),
};
