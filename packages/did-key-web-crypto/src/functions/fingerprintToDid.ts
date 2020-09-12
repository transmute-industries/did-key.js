export const fingerprintToDid = (fingerprint: string, methodName = 'key') => {
  return `did:${methodName}:${fingerprint}`;
};
