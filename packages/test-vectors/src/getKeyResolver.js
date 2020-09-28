const getKeyResolver = (fixture, contentType = 'application/did+ld+json') => {
  // always takes a full URI, did:example:123#456
  const keyResolver = ({ id }) => {
    const [controller, fragment] = id.split('#');
    if (!controller) {
      throw new Error(
        'Key resolver does not support relative URIs (fragments).'
      );
    }
    let result = fixture.find((fix) => {
      return (
        // just fragment, #456
        fix.keypair[contentType].controller === controller &&
        fix.keypair[contentType].id.indexOf(fragment) !== -1
      );
    });
    if (result) {
      return {
        ...result.keypair[contentType],
        id:
          result.keypair[contentType].controller +
          result.keypair[contentType].id,
      };
    }
    throw new Error(`Key ${id} not found in fixture`);
  };
  return keyResolver;
};

module.exports = { getKeyResolver };
