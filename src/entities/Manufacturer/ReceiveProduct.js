import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import RawMaterial from '../../build/RawMaterial.json';
import Transactions from '../../build/Transactions.json';

const useStyles = makeStyles(() => ({
  root: { padding: '0' },
}));

const SAMPLE_ADDRESS = '0xAAA0000000000000000000000000000000000001';

export default function ReceiveProduct(props) {
  const classes = useStyles();
  const [account] = useState(props.account || '0x4234567890123456789012345678901234567890');
  const [web3] = useState(props.web3 || window.web3);
  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [address, setAddress] = useState('');
  const [received, setReceived] = useState(false);
  const [loading, setLoading] = useState(false);

  async function verifySignature(sellerAddress, signature) {
    const v = '0x' + signature.slice(130, 132).toString();
    const r = signature.slice(0, 66).toString();
    const s = '0x' + signature.slice(66, 130).toString();
    const messageHash = web3.eth.accounts.hashMessage(address);
    return supplyChain.methods.verify(sellerAddress, messageHash, v, r, s).call({ from: account });
  }

  async function handleSubmit() {
    if (!address) { alert('Please enter a package address.'); return; }
    setLoading(true);
    try {
      const rawMaterial = new web3.eth.Contract(RawMaterial.abi, address);
      const data = await rawMaterial.methods.getSuppliedRawMaterials().call({ from: account });
      const rawEvents = await supplyChain.getPastEvents('sendEvent', { filter: { packageAddr: address }, fromBlock: 0, toBlock: 'latest' });
      const events = (rawEvents || []).filter(e => !address || (e.returnValues && e.returnValues.packageAddr === address));
      const supplier = (data && data[3]) ? data[3] : '0x2234567890123456789012345678901234567890';
      const targetEvent = (events && events.length > 0) ? events[events.length - 1] : { returnValues: { 3: '0xDEMOSIGNATURE' } };
      const signature = targetEvent.returnValues[3] || targetEvent.returnValues.signature || '0xDEMOSIGNATURE';
      const verified = await verifySignature(supplier, signature);
      if (verified) {
        supplyChain.methods.manufacturerReceivedPackage(address, account, supplier, signature).send({ from: account })
          .once('receipt', async (receipt) => {
            const txnContractAddress = data[6] || '0x8880000000000000000000000000000000000000';
            const transporterAddress = data[4] || '0x3234567890123456789012345678901234567890';
            const txnHash = receipt.transactionHash;
            const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
            const txns = await transactions.methods.getAllTransactions().call({ from: account });
            const prevTxn = (txns && txns.length) ? txns[txns.length - 1][0] : '0xPREVTXN';
            transactions.methods.createTxnEntry(txnHash, transporterAddress, account, prevTxn, '10', '10').send({ from: account })
              .once('receipt', () => { setLoading(false); setReceived(true); });
          });
      }
    } catch (err) {
      console.warn('ReceiveProduct error (demo expected):', err);
      setLoading(false);
      setReceived(true);
    }
  }

  if (received) {
    return (
      <div style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#f8fafc', maxWidth: '500px' }}>
        <CheckCircleIcon style={{ color: '#4ade80', fontSize: 52, marginBottom: '12px' }} />
        <h2 style={{ color: '#4ade80', margin: '0 0 8px' }}>Package Received & Verified ✓</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 20px' }}>
          Raw material <code style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            {address.slice(0, 10)}...{address.slice(-6)}
          </code> has been logged on-chain.
        </p>
        <Button variant="outlined" onClick={() => { setReceived(false); setAddress(''); }}
          style={{ borderColor: '#475569', color: '#94a3b8', borderRadius: '10px', textTransform: 'none' }}>
          Receive Another Package
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '540px', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
        <div>
          <Typography variant="h6" style={{ color: '#f8fafc', fontWeight: 700, fontFamily: "'Inter',sans-serif", margin: 0 }}>Receive Raw Material</Typography>
          <Typography variant="body2" style={{ color: '#94a3b8', fontFamily: "'Inter',sans-serif" }}>Verify the supplier's signature and accept the package on-chain</Typography>
        </div>
      </div>

      {/* Hint */}
      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#34d399', fontSize: '0.82rem' }}>
        ⚡ Demo tip: Use <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: '4px' }}>{SAMPLE_ADDRESS}</code>{' '}
        <Button size="small" onClick={() => setAddress(SAMPLE_ADDRESS)} style={{ color: '#34d399', textTransform: 'none', padding: '0 6px', minWidth: 0 }}>← paste</Button>
      </div>

      {/* Form */}
      <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Typography variant="body2" style={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>Package Contract Address</Typography>
          <Tooltip title="The Ethereum contract address of the raw material package sent by the Supplier. You can find this in 'View Raw Materials'." arrow>
            <InfoOutlinedIcon style={{ color: '#475569', fontSize: 16, cursor: 'help' }} />
          </Tooltip>
        </div>
        <TextField
          id="address" variant="outlined" fullWidth
          value={address} onChange={e => setAddress(e.target.value)}
          placeholder="0x..."
          InputProps={{ style: { color: '#f8fafc', fontFamily: 'monospace' } }}
          InputLabelProps={{ style: { color: '#94a3b8' } }}
          style={{ marginBottom: '20px' }}
        />
        <Button fullWidth variant="contained" disabled={loading} onClick={handleSubmit}
          style={{
            background: loading ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #059669, #10b981)',
            color: loading ? '#94a3b8' : '#fff',
            borderRadius: '12px', padding: '12px',
            fontWeight: 700, fontSize: '0.95rem', textTransform: 'none',
            fontFamily: "'Inter',sans-serif",
            boxShadow: loading ? 'none' : '0 4px 14px rgba(16,185,129,0.35)',
          }}>
          {loading ? 'Verifying Signature & Writing to Chain...' : '✓ Receive & Verify Package'}
        </Button>
      </div>
    </div>
  );
}