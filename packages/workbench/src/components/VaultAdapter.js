import React from 'react';

import { DataVault } from '@transmute/material-did-core';

export const VaultAdapter = ({ wallet, syncVault }) => {
  return (
    <div>
      <DataVault {...wallet} syncVault={syncVault} />
    </div>
  );
};
