import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Transactions from '../../build/Transactions.json';
import Medicine from '../../build/Medicine.json';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// Pre-filled demo values
const DEMO_DEFAULTS = {
  description: 'Paracetamol 500mg Tablets',
  quantity: '10000',
  rawMatAddress: '0xAAA0000000000000000000000000000000000001',
  manufacturerAddress: '0x4234567890123456789012345678901234567890',
  transporterAddress: '0x3234567890123456789012345678901234567890',
};

export default function CreateMedicine(props) {

  const [account] = useState(props.account || '0x4234567890123456789012345678901234567890');
  const [web3] = useState(props.web3 || window.web3);
  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [description, setDescription] = useState(DEMO_DEFAULTS.description);
  const [quantity, setQuantity] = useState(DEMO_DEFAULTS.quantity);
  const [rawMatAddress, setRawMatAddress] = useState(DEMO_DEFAULTS.rawMatAddress);
  const [manufacturerAddress, setManufacturerAddress] = useState(DEMO_DEFAULTS.manufacturerAddress);
  const [transporterAddress, setTransporterAddress] = useState(DEMO_DEFAULTS.transporterAddress);
  const [createdAddress, setCreatedAddress] = useState('');
  const handleInputChange = (e) => {
    if (e.target.id === 'description') setDescription(e.target.value);
    else if (e.target.id === 'quantity') setQuantity(e.target.value);
    else if (e.target.id === 'rawMatAddress') setRawMatAddress(e.target.value);
    else if (e.target.id === 'manufacturerAddress') setManufacturerAddress(e.target.value);
    else if (e.target.id === 'transporterAddress') setTransporterAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !quantity) {
      alert('Medicine Description and Quantity are required.');
      return;
    }
    isLoading(true);
    try {
      // Safe encoding for demo mode: web3.utils may be proxied
      const d = (web3 && web3.utils && web3.utils.fromAscii)
        ? web3.utils.padRight(web3.utils.fromAscii(description), 64)
        : description;

      supplyChain.methods
        .manufacturerCreatesMedicine(manufacturerAddress, d, [rawMatAddress], quantity, [transporterAddress])
        .send({ from: account })
        .on('error', (err) => {
           console.warn('Transaction rejected or failed:', err);
           isLoading(false);
           alert('Transaction failed or was rejected by user.');
        })
        .once('receipt', async (receipt) => {
          try {
            const medicineAddresses = await supplyChain.methods.getAllCreatedMedicines().call({ from: account });
            const medicineAddress = medicineAddresses[medicineAddresses.length - 1];
            setCreatedAddress(medicineAddress); // Store for QR Code
            
            const medicine = new web3.eth.Contract(Medicine.abi, medicineAddress);
            const data = await medicine.methods.getMedicineInfo().call({ from: account });
            const txnContractAddress = data[7] || '0x8880000000000000000000000000000000000000';
            const txnHash = receipt.transactionHash;
            const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
            transactions.methods.createTxnEntry(txnHash, account, medicineAddress, txnHash, '10', '10').send({ from: account });
          } catch (innerErr) {
            console.warn('Post-creation steps failed (demo expected):', innerErr);
          }
          isLoading(false);
          setSuccess(true);
        });
    } catch (err) {
      console.warn('Create medicine setup error:', err);
      isLoading(false);
      alert('Failed to initiate transaction. Check your connection.');
    }
  };

  if (success) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        borderRadius: '16px',
        padding: '40px 32px',
        textAlign: 'center',
        color: '#f8fafc',
        maxWidth: '500px',
      }}>
        <CheckCircleIcon style={{ color: '#4ade80', fontSize: 56, marginBottom: '16px' }} />
        <h2 style={{ color: '#4ade80', margin: '0 0 8px 0' }}>Medicine Batch Created! ✓</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
          <b style={{ color: '#f8fafc' }}>{description}</b> — {Number(quantity).toLocaleString()} units minted to the blockchain.
        </p>

        {/* QR Code Section */}
        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', marginBottom: '24px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification QR Code</p>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', display: 'inline-block' }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${window.location.origin}/verify?address=${createdAddress || '0xDEMO'}`} 
              alt="QR Code" 
              style={{ display: 'block', width: '180px', height: '180px' }}
            />
          </div>
          <p style={{ margin: '12px 0 0 0', fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', wordBreak: 'break-all' }}>
            {createdAddress || '0xDEMO'}
          </p>
        </div>

        <div>
          <Button
            variant="outlined"
            onClick={() => { setSuccess(false); setCreatedAddress(''); }}
            style={{ borderColor: '#475569', color: '#94a3b8', borderRadius: '10px', textTransform: 'none' }}
          >
            Create Another Batch
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: 'rgba(30,41,59,0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '44px', height: '44px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
        }}>
          <span role="img" aria-label="factory">🏭</span>
        </div>
        <div>
          <Typography variant="h6" style={{ color: '#f8fafc', fontWeight: 700, fontFamily: "'Inter', sans-serif", margin: 0 }}>
            Create Medicine Batch
          </Typography>
          <Typography variant="body2" style={{ color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
            Mint a new pharmaceutical batch as an Ethereum smart contract
          </Typography>
        </div>
      </div>

      {/* Demo hint */}
      <div style={{
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '16px',
        color: '#34d399',
        fontSize: '0.82rem',
      }}>
        ⚡ Fields are pre-filled with demo data — click <b>Create Batch</b> to simulate a blockchain transaction.
      </div>

      {/* Form */}
      <div style={{
        background: 'rgba(30,41,59,0.7)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '24px',
      }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="Medicine Description / Drug Name"
                variant="outlined"
                fullWidth
                value={description}
                onChange={handleInputChange}
                InputProps={{ style: { color: '#f8fafc' } }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="quantity"
                label="Batch Quantity (units)"
                variant="outlined"
                fullWidth
                value={quantity}
                onChange={handleInputChange}
                InputProps={{ style: { color: '#f8fafc' } }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="rawMatAddress"
                label="Raw Material Contract Address"
                variant="outlined"
                fullWidth
                value={rawMatAddress}
                onChange={handleInputChange}
                InputProps={{ style: { color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.8rem' } }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="manufacturerAddress"
                label="Manufacturer Wallet Address"
                variant="outlined"
                fullWidth
                value={manufacturerAddress}
                onChange={handleInputChange}
                InputProps={{ style: { color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.8rem' } }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="transporterAddress"
                label="Assigned Transporter Wallet Address"
                variant="outlined"
                fullWidth
                value={transporterAddress}
                onChange={handleInputChange}
                InputProps={{ style: { color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.8rem' } }}
                InputLabelProps={{ style: { color: '#94a3b8' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: loading ? '#94a3b8' : '#fff',
                  borderRadius: '12px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(16,185,129,0.35)',
                  marginTop: '8px',
                }}
              >
                {loading ? 'Minting on Blockchain...' : <><span role="img" aria-label="factory">🏭</span> Create Medicine Batch</>}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}
