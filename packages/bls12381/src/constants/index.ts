// Pulled from https://github.com/mattrglobal/bls12381-key-pair
// License is Apache-2.0

/**
 * z represents the multibase encoding scheme of base58 encoding
 * @see https://github.com/multiformats/multibase/blob/master/multibase.csv#L18
 * @ignore
 */
const MULTIBASE_ENCODED_BASE58_IDENTIFIER = "z";

/**
 * 0x01 indicates the end of the leading bytes according to variable integer spec
 * @see https://github.com/multiformats/multicodec
 * @ignore
 */
const VARIABLE_INTEGER_TRAILING_BYTE = 0x01;


/**
 * 0xea indicates a BLS 12-381 G1 public key
 *
 */
const BLS12381G1_MULTICODEC_IDENTIFIER = 0xea;


/**
 * 0xeb indicates a BLS 12-381 G2 public key
 *
 */
const BLS12381G2_MULTICODEC_IDENTIFIER = 0xeb;


/**
 * 0xee indicates a BLS 12-381 G1 concat with BLS 12-381 G2
 *
 */
const BLS12381G1ANDG2_MULTICODEC_IDENTIFIER = 0xee;


export {
    MULTIBASE_ENCODED_BASE58_IDENTIFIER,
    VARIABLE_INTEGER_TRAILING_BYTE,
    BLS12381G1_MULTICODEC_IDENTIFIER,
    BLS12381G2_MULTICODEC_IDENTIFIER,
    BLS12381G1ANDG2_MULTICODEC_IDENTIFIER
}