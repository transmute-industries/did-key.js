import React from 'react';

import { UniversalWallet } from '@transmute/material-did-core';

const image =
  'https://www.transmute.industries/svg/Logo-Transmute-icon-Purp.svg';

export const VaultWallet = (props) => {
  return (
    <div>
      <UniversalWallet walletState={props.wallet} image={image} {...props} />
    </div>
  );
};
