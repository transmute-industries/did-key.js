import React from 'react';
import { Typography, Grid, Link } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '32px',
    marginTop: '32px',
  },
  title: {
    color: theme.palette.text.primary,
  },
  description: {
    color: theme.palette.text.primary,
    margin: '8px 0px',
  },
}));

export const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={4}>
          <Typography className={classes.title} variant={'h5'} gutterBottom>
            About Transmute
          </Typography>
          <Link href="https://www.transmute.industries/" color={'secondary'}>
            www.transmute.industries
          </Link>
          <Typography className={classes.description}>
            Transmute secures critical trade data related to suppliers, products
            and shipments to give customers a competitive edge in the
            increasingly dynamic global marketplace.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography className={classes.title} variant={'h5'} gutterBottom>
            About DIDs
          </Typography>
          <Link href="https://www.w3.org/TR/did-core" color={'secondary'}>
            W3C Decentralized Identifiers
          </Link>
          <Typography className={classes.description}>
            Decentralized identifiers (DIDs) are a new type of identifier that
            enables verifiable, decentralized digital identity. A DID refers to
            any subject (e.g., a person, organization, thing, data model,
            abstract entity, etc.) as determined by the controller of the DID.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography className={classes.title} variant={'h5'} gutterBottom>
            About VCs
          </Typography>

          <Link href="https://www.w3.org/TR/vc-data-model/" color={'secondary'}>
            W3C Verifiable Credentials
          </Link>
          <Typography className={classes.description}>
            Verifiable Credentials (VCs) are a data model for expressing
            cryptographically verifiable claims. These claims are often issued
            or presented by Decentralized Identifiers.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};
