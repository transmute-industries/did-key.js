import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';

import logo from '../../assets/logo-with-text-white.svg';

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#FFF',
  },
  description: {
    color: '#FFF',
    marginTop: '48px',
  },
}));

export const Hero = () => {
  const classes = useStyles();
  return (
    <div
      style={{
        width: '50%',
        margin: 'auto',
        textAlign: 'center',
        paddingTop: '7%',
      }}
    >
      <Typography className={classes.title} variant={'h1'} gutterBottom>
        DID Method Key
      </Typography>

      <Typography className={classes.description} variant={'h6'} gutterBottom>
        <strong>did:key</strong> is a{' '}
        <Link
          href="https://www.w3.org/TR/did-core/#methods"
          color={'secondary'}
        >
          DID Method
        </Link>{' '}
        which is offline friendly, cryptographically self certifying, requires
        no trust of certificate authoritites or blockchain and is ideal for
        ephemeral use.
      </Typography>
      <img
        src={logo}
        alt="Transmute Logo"
        style={{ height: '42px', marginTop: '48px' }}
      />
    </div>
  );
};
