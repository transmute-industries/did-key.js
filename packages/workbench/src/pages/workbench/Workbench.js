import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Base from '../base/base';

import { VaultWallet } from '../../components/VaultWallet';
import { VaultAdapter } from '../../components/VaultAdapter';

export const Workbench = (props) => {
  if (!props.wallet) {
    return <div>loading...</div>;
  }
  return (
    <Base>
      <Grid container spacing={4}>
        <Grid item>
          <VaultWallet {...props} />
        </Grid>
        <Grid item>
          <VaultAdapter {...props} />
        </Grid>
      </Grid>
    </Base>
  );
};

Workbench.propTypes = {
  wallet: PropTypes.any,
};
