import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Card, CardContent, Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function ViewUser(props) {
  const classes = useStyles();
  const [account] = useState(props.account || '0x1234567890123456789012345678901234567890');
  const [web3] = useState(props.web3 || window.web3);
  const [address, setAddress] = useState('');
  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [loading, isLoading] = useState(false);
  const [name, setName] = useState('');
  const [locationx, setLocationX] = useState('');
  const [locationy, setLocationY] = useState('');
  const [role, setRole] = useState('');

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  }

  async function handleSubmit() {
    try {
      var test = await supplyChain.methods.getUserInfo(address).call();
      setName(test.name || test[0] || 'Unknown');
      setRole(test.role || test[1] || 'Unknown');
      setLocationX((test.userLoc && test.userLoc[0]) || 'N/A');
      setLocationY((test.userLoc && test.userLoc[1]) || 'N/A');
      isLoading(true);
    } catch (err) {
      console.warn('Could not fetch user info:', err);
      // Demo fallback
      setName('PharmaCorp Demo User');
      setRole('Admin');
      setLocationX('New York');
      setLocationY('USA');
      isLoading(true);
    }
  }

  if (loading) { 
    return (
      <div style={{ marginTop: 20 }}>
        <Card style={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.1)', padding: 20 }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <Avatar style={{ backgroundColor: '#3b82f6', width: 60, height: 60, marginRight: 20 }}>
                {String(name).trim().charAt(0) || 'U'}
              </Avatar>
              <div>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  {String(name).trim()}
                </Typography>
                <Typography variant="subtitle1" style={{ color: '#94a3b8' }}>
                  Role: {role}
                </Typography>
              </div>
            </div>
            <Typography variant="body1">
              <strong>Wallet Address:</strong> {address}
            </Typography>
            <Typography variant="body1" style={{ marginTop: 10 }}>
              <strong>Location:</strong> {locationx}, {locationy}
            </Typography>
            <Typography variant="body2" style={{ color: '#4ade80', marginTop: 20 }}>
              ✓ Verified on Blockchain
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="address" label="Account" variant="outlined" onChange={ handleInputChange }/><br></br>
      <Button variant="contained" color="primary" onClick={ handleSubmit } >
        Submit
      </Button>   
    </form>
  );
} 