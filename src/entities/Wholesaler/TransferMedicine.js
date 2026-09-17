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

export default function TransferMedicine(props) {
    const [account] = useState(props.account);
    // eslint-disable-next-line no-unused-vars
    const [web3] = useState(props.web3);
    const [supplyChain] = useState(props.supplyChain);
    const [medicineAddress, setMedicineAddress] = useState("");
    const [transporterAddress, setTransporterAddress] = useState("");
    const [distributorAddress, setDistributorAddress] = useState("");
    const [loading, isLoading] = useState(false);

    const classes = useStyles();

    const handleInputChange = (e) => {
        if (e.target.id === 'medicineAddress') {
            setMedicineAddress(e.target.value);
        } else if (e.target.id === 'transporterAddress') {
            setTransporterAddress(e.target.value);
        } else if (e.target.id === 'distributorAddress') {
            setDistributorAddress(e.target.value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        isLoading(true);
        supplyChain.methods.transferMedicineWtoD(medicineAddress, transporterAddress, distributorAddress).send({ from: account })
            .once('receipt', async (receipt) => {

                isLoading(false);
            })
    }

    return (
        <Grid container style={{ display: "flex", flexDirection: "column", maxWidth: 560, gap: 16 }}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>

                    <Typography component="h1" variant="h5">Enter Package To be Transferred</Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <TextField variant="outlined" onChange={handleInputChange} required fullWidth id="medicineAddress" label="Package Address" name="medicineAddress" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField variant="outlined" onChange={handleInputChange} required fullWidth id="transporterAddress" label="Transporter Address" name="transporterAddress" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField variant="outlined" onChange={handleInputChange} required fullWidth id="distributorAddress" label="Distributor Address" name="distributorAddress" />
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
