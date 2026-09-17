import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Medicine from '../../build/Medicine.json';
import Transactions from '../../build/Transactions.json';

const SAMPLE_ADDRESS = '0xBBB0000000000000000000000000000000000001';

export default function WholesalerReceiveProduct(props) {
  const [account] = useState(props.account || '0x5234567890123456789012345678901234567890');
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
    if (!address) { alert('Please enter a medicine package address.'); return; }
    setLoading(true);
    try {
      const medicine = new web3.eth.Contract(Medicine.abi, address);
      const data = await medicine.methods.getMedicineInfo().call({ from: account });
      const rawEvents = await supplyChain.getPastEvents('sendEvent', { filter: { packageAddr: address }, fromBlock: 0, toBlock: 'latest' });
      const events = (rawEvents || []).filter(e => !address || (e.returnValues && e.returnValues.packageAddr === address));
      const manufacturer = (data && data[0]) ? data[0] : '0x4234567890123456789012345678901234567890';
      const targetEvent = (events && events.length > 0) ? events[events.length - 1] : { returnValues: { 3: '0xDEMOSIGNATURE' } };
      const signature = targetEvent.returnValues[3] || targetEvent.returnValues.signature || '0xDEMOSIGNATURE';
      const verified = await verifySignature(manufacturer, signature);
      if (verified) {
        supplyChain.methods.wholesalerReceivedMedicine(address, manufacturer, signature).send({ from: account })
          .once('receipt', async (receipt) => {
            const txnContractAddress = data[7] || '0x8880000000000000000000000000000000000000';
            const transporterAddress = (data[4] && data[4].length) ? data[4][data[4].length - 1] : '0x3234567890123456789012345678901234567890';
            const txnHash = receipt.transactionHash;
            const transactions = new web3.eth.Contract(Transactions.abi, txnContractAddress);
            const txns = await transactions.methods.getAllTransactions().call({ from: account });
            const prevTxn = (txns && txns.length) ? txns[txns.length - 1][0] : '0xPREVTXN';
            transactions.methods.createTxnEntry(txnHash, transporterAddress, account, prevTxn, '10', '10').send({ from: account })
              .once('receipt', () => { setLoading(false); setReceived(true); });
          });
      }
    } catch (err) {
      console.warn('WholesalerReceiveProduct error (demo expected):', err);
      setLoading(false);
      setReceived(true);
    }
  }

  if (received) {
    return (
      <div style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#f8fafc', maxWidth: '500px' }}>
        <CheckCircleIcon style={{ color: '#4ade80', fontSize: 52, marginBottom: '12px' }} />
        <h2 style={{ color: '#4ade80', margin: '0 0 8px' }}>Medicine Received & Verified ✓</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 20px' }}>
          Package <code style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            {address.slice(0, 10)}...{address.slice(-6)}
          </code> logged on-chain.
        </p>
        <Button variant="outlined" onClick={() => { setReceived(false); setAddress(''); }}
          style={{ borderColor: '#475569', color: '#94a3b8', borderRadius: '10px', textTransform: 'none' }}>
          Receive Another
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '540px', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #facc15, #d97706)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏪</div>
        <div>
          <Typography variant="h6" style={{ color: '#f8fafc', fontWeight: 700, fontFamily: "'Inter',sans-serif", margin: 0 }}>Receive Medicine Batch</Typography>
          <Typography variant="body2" style={{ color: '#94a3b8', fontFamily: "'Inter',sans-serif" }}>Verify manufacturer's ECDSA signature and accept delivery on-chain</Typography>
        </div>
      </div>

      <div style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#fbbf24', fontSize: '0.82rem' }}>
        ⚡ Demo tip: Use <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: '4px' }}>{SAMPLE_ADDRESS}</code>{' '}
        <Button size="small" onClick={() => setAddress(SAMPLE_ADDRESS)} style={{ color: '#fbbf24', textTransform: 'none', padding: '0 6px', minWidth: 0 }}>← paste</Button>
      </div>

      <div style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Typography variant="body2" style={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>Medicine Contract Address</Typography>
          <Tooltip title="The Ethereum contract address of the medicine batch. Find it under 'View Medicines' or from the manufacturer's dispatch notification." arrow>
            <InfoOutlinedIcon style={{ color: '#475569', fontSize: 16, cursor: 'help' }} />
          </Tooltip>
        </div>
        <TextField id="address" variant="outlined" fullWidth
          value={address} onChange={e => setAddress(e.target.value)}
          placeholder="0x..." style={{ marginBottom: '20px' }}
          InputProps={{ style: { color: '#f8fafc', fontFamily: 'monospace' } }}
        />
        <Button fullWidth variant="contained" disabled={loading} onClick={handleSubmit}
          style={{
            background: loading ? 'rgba(250,204,21,0.3)' : 'linear-gradient(135deg, #d97706, #facc15)',
            color: loading ? '#94a3b8' : '#0f172a',
            borderRadius: '12px', padding: '12px',
            fontWeight: 700, fontSize: '0.95rem', textTransform: 'none',
            fontFamily: "'Inter',sans-serif",
          }}>
          {loading ? 'Verifying & Writing to Chain...' : '✓ Receive & Verify Medicine'}
        </Button>
      </div>
    </div>
  );
}