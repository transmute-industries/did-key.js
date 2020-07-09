import { withHandlers } from "recompose";
import { EdvClient } from "edv-client";
import { UniversalWallet2020, VaultClient } from "@transmute/universal-wallet";

// correct horse battery staple

const getClient = async (wallet) => {
  let _wallet = new UniversalWallet2020(wallet.contents);
  const entropy = _wallet.contents.find((c) => {
    return c.type === "Entropy";
  });
  const ed25519Key = _wallet.contents.find((c) => {
    return c.type === "Ed25519VerificationKey2018";
  });
  ed25519Key.controller = ed25519Key.id.split("#")[0];
  const x25519Key = _wallet.contents.find((c) => {
    return c.type === "X25519KeyAgreementKey2019";
  });
  x25519Key.controller = x25519Key.id.split("#")[0];
  let client = await VaultClient.fromDerivedContents(
    wallet.vaultEndpoint,
    ed25519Key,
    x25519Key,
    Buffer.from(entropy.value, "hex")
  );
  return client;
};

const isContentPersisted = (localContents, id) => {
  return (
    localContents.find((c) => {
      return c.id === id;
    }) !== undefined
  );
};

export default withHandlers({
  setUniversalWalletProp: ({ setUniversalWalletProp }) => (payload) => {
    setUniversalWalletProp(payload);
  },
  generateWallet: ({ setUniversalWalletProp }) => async (_seed) => {
    if (!_seed) {
      throw new Error("seed is required.");
    }
    let wallet = await UniversalWallet2020.generate(_seed);
    setUniversalWalletProp({
      status: wallet.status,
      contents: wallet.contents,
    });
  },
  toggleLockStatus: ({ setUniversalWalletProp }) => async ({
    status,
    password,
    contents,
  }) => {
    let wallet = new UniversalWallet2020(contents);
    wallet.status = status;

    if (status === "LOCKED") {
      await wallet.unlock(password);
    }
    if (status === "UNLOCKED") {
      await wallet.lock(password);
    }
    setUniversalWalletProp({
      status: wallet.status,
      contents: wallet.contents,
    });
  },

  deleteWallet: ({ setUniversalWalletProp }) => async () => {
    setUniversalWalletProp({
      status: "UNLOCKED",
      contents: [],
    });
  },

  importWallet: ({ setUniversalWalletProp }) => async (encryptedWallet) => {
    let wallet = new UniversalWallet2020();
    await wallet.import(encryptedWallet);
    setUniversalWalletProp({
      status: wallet.status,
      contents: wallet.contents,
    });
  },

  exportWallet: () => async (status, contents) => {
    if (status !== "LOCKED") {
      throw new Error("Cannot export unlocked wallet.");
    }
    let wallet = new UniversalWallet2020(contents);
    wallet.status = status;
    return wallet.export();
  },

  saveWallet: ({ setUniversalWalletProp }) => async (contents) => {
    setUniversalWalletProp({
      contents,
    });
  },
  issueCredential: ({ wallet, setUniversalWalletProp }) => async ({
    credential,
    options,
  }) => {
    let _wallet = new UniversalWallet2020(wallet.contents);
    const verifiableCredential = await _wallet.issue({
      credential,
      options,
    });
    setUniversalWalletProp({
      contents: [verifiableCredential, ..._wallet.contents],
    });
  },
  proveVerifiableCredential: ({ wallet, setUniversalWalletProp }) => async ({
    verifiableCredential,
    options,
  }) => {
    let _wallet = new UniversalWallet2020(wallet.contents);
    const verifiablePresentation = await _wallet.prove({
      verifiableCredential,
      options,
    });
    setUniversalWalletProp({
      contents: [verifiablePresentation, ..._wallet.contents],
    });
  },
  syncVault: ({ wallet, setUniversalWalletProp }) => async () => {
    setUniversalWalletProp({
      isSyncing: true,
    });
    const client = await getClient(wallet);

    let contents = [];
    try {
      contents = await client.getWalletContents();
    } catch (e) {
      console.log(e);
      if (e.message === "Request failed with status code 404") {
        // no-op we will add content that does not existt anyway..
      }
    }
    // console.log('remote wallet contents: ', contents);

    for (const content of wallet.contents) {
      // console.log({ content });
      const isPersisted = isContentPersisted(contents, content.id);
      // console.log({ isPersisted });
      if (!isPersisted) {
        let data = JSON.parse(JSON.stringify(content));
        delete data.tableData;
        const doc = {
          id: await EdvClient.generateId(),
          content: {
            schema: "https://schema.org/UniversalWallet",
            data,
          },
        };
        await client.addWalletContent(doc);
        // console.log({ response });
      }
    }

    contents = await client.getWalletContents();
    setUniversalWalletProp({
      isSyncing: false,
      contents,
    });
  },
});
