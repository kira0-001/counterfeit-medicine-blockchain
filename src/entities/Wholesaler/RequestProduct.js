import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function RequestProductWholesaler(props) {
  const [ account ] = useState(props.account);
  // eslint-disable-next-line no-unused-vars
  const [ web3 ] = useState(props.web3);
  const [ supplyChain ] = useState(props.supplyChain);
  const [ medicineAddress, setmedicineAddress ] = useState("");
  const [ manufacturerAddress, setmanufacturerAddress ] = useState("");
  const [ signature, setSignature ] = useState("");
  const [ loading, isLoading ] = useState(false);

  const classes = useStyles();

  const handleInputChange = (e) => {
    if (e.target.id === 'medicineAddress') {
      setmedicineAddress(e.target.value);
    } else if (e.target.id === 'manufacturerAddress') {
      setmanufacturerAddress(e.target.value);
    } else if (e.target.id === 'signature') {
      setSignature(e.target.value);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    supplyChain.methods.requestProduct(account, manufacturerAddress, medicineAddress, signature).send({ from: account })
      .once('receipt', async () => {
        alert('Request Made to Manufacturer!');
        isLoading(false);
      })
  }

  return (
    <Grid container style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>

          <Typography component="h1" variant="h5">Enter Package To be Requested</Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField variant="outlined" onChange={handleInputChange} required fullWidth id="medicineAddress" label="Package Address" name="medicineAddress" />
              </Grid>
              <Grid item xs={12}>
                <TextField variant="outlined" onChange={handleInputChange} required fullWidth id="manufacturerAddress" label="Manufacturer Address" name="manufacturerAddress" />
              </Grid>
              <Grid item xs={12}>
                <TextField variant="outlined" onChange={handleInputChange} required fullWidth id="signature" label="Signature" name="signature" />
              </Grid>

            </Grid>
            <Button
              type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleSubmit} disabled={loading} >
              {loading ? 'Processing...' : 'Submit'}
            </Button>

          </form>
        </div>
      </Container>
    </Grid>
  );
}
