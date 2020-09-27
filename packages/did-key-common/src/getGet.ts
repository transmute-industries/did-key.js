export const getGet = (resolve: any) => {
  const get = async ({ did, url }: any = {}) => {
    did = did || url;
    if (!did) {
      throw new TypeError('"did" must be a string.');
    }
    const result = await resolve(did);
    return result.didDocument;
  };
  return get;
};
