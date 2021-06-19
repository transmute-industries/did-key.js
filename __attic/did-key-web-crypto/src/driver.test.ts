import { driver } from './index';

it('can resolve P-256 as did+json', async () => {
  const did =
    'did:key:zrurwcJZss4ruepVNu1H3xmSirvNbzgBk9qrCktB6kaewXnJAhYWwtP3bxACqBpzjZdN7TyHNzzGGSSH5qvZsSDir9z';

  const res = await driver.resolve(did, { accept: 'application/did+json' });
  expect(res.didDocument.id).toBe(did);
  expect(res.didDocumentMetadata['content-type']).toBe('application/did+json');
});

it('can resolve P-384 as did+json', async () => {
  const did =
    'did:key:zFwepbBSaPFjt5T1zWptHaXugLNxHYABfJrDoAZRYxKjNkpdfrniF3pvYQAXwxVB7afhmsgzYtSCzTVZQ3F5SPHzP5PuHgtBGNYucZTSrnA7yTTDr7WGQZaTTkJWfiH47jW5ahU';

  const res = await driver.resolve(did, { accept: 'application/did+json' });
  expect(res.didDocument.id).toBe(did);
  expect(res.didDocumentMetadata['content-type']).toBe('application/did+json');
});

it('can resolve P-521 as did+json', async () => {
  const did =
    'did:key:zWGhj2NTyCiehTPioanYSuSrfB7RJKwZj6bBUDNojfGEA21nr5NcBsHme7hcVSbptpWKarJpTcw814J3X8gVU9gZmeKM27JpGA5wNMzt8JZwjDyf8EzCJg5ve5GR2Xfm7d9Djp73V7s35KPeKe7VHMzmL8aPw4XBniNej5sXapPFoBs5R8m195HK';

  const res = await driver.resolve(did, { accept: 'application/did+json' });
  expect(res.didDocument.id).toBe(did);
  expect(res.didDocumentMetadata['content-type']).toBe('application/did+json');
});
