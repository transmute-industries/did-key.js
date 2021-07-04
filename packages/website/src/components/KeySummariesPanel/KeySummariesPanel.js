import React from 'react';
import { Typography, Grid, Link } from '@material-ui/core';
import { KeyCard } from './KeyCard';

import keys from './keys.json';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '32px',
  },
  title: {
    color: theme.palette.text.primary,
  },
  card: {
    background: theme.palette.background.dark,
    padding: '16px',
    paddingTop: '32px',
  },
}));

export const KeySummariesPanel = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <Typography className={classes.title} variant={'h2'} gutterBottom>
          Choose a public key cryptosystem
        </Typography>
        <div style={{ marginBottom: '48px' }}>
          <Link href="https://safecurves.cr.yp.to" color={'secondary'}>
            Read about safe curves
          </Link>
        </div>
        <Grid container spacing={3}>
          {keys.map((k) => {
            return (
              <Grid key={k.name} item xs={4}>
                <KeyCard data={k} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};
