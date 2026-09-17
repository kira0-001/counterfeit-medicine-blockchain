import React, { useState, useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import WarningIcon from '@material-ui/icons/Warning';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

// Demo sample packages the Transporter can handle
const SAMPLE_PACKAGES = [
  {
    address: '0xAAA0000000000000000000000000000000000001',
    name: 'Active Pharma Ingredient — Paracetamol (500 kg)',
    from: 'Global Chemicals Ltd. (Berlin)',
    to: 'MediLife Labs (Geneva)',
    temp: '4.2 °C',
    type: '1',
  },
  {
    address: '0xBBB0000000000000000000000000000000000001',
    name: 'Paracetamol 500mg Tablets (Batch #MED-2026-X9)',
    from: 'MediLife Labs (Geneva)',
    to: 'EuroPharma Wholesale (Paris)',
    temp: '3.9 °C',
    type: '2',
  },
  {
    address: '0xBBB0000000000000000000000000000000000002',
    name: 'Amoxicillin 250mg Capsules (Batch #AMX-9942)',
    from: 'EuroPharma Wholesale (Paris)',
    to: 'City Health Distributors (Madrid)',
    temp: '4.1 °C',
    type: '2',
  },
];

export default function HandlePackage(props) {

  const [account] = useState(props.account || '0x3234567890123456789012345678901234567890');

  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));

  const [pAddress, setpAddress] = useState('');
  const [type, setType] = useState('1');
  const [cid, setCid] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  // IoT Simulator State
  const [tempData, setTempData] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const intervalRef = useRef(null);

  // Initialize Simulator Data
  useEffect(() => {
    let initialData = [];
    let time = new Date().getTime() - 60000; // 60 seconds ago
    for (let i = 0; i < 30; i++) {
      initialData.push({ time: new Date(time), temp: 4 + Math.random() * 2 });
      time += 2000;
    }
    setTempData(initialData);

    intervalRef.current = setInterval(() => {
      setTempData(prev => {
        const newTemp = isAlert ? 8.5 + Math.random() * 3 : 4 + Math.random() * 2;
        const newData = [...prev.slice(1), { time: new Date(), temp: newTemp }];
        return newData;
      });
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [isAlert]);

  const triggerAlert = () => {
    setIsAlert(true);
    setTimeout(() => setIsAlert(false), 10000); // Alert lasts 10 seconds
  };

  const handleSelectSample = (pkg) => {
    setSelectedSample(pkg);
    setpAddress(pkg.address);
    setType(pkg.type);
    setCid(`CID-${Date.now().toString(36).toUpperCase()}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pAddress) {
      alert('Please enter or select a Package Address.');
      return;
    }
    setLoading(true);
    if (supplyChain) {
      supplyChain.methods.transporterHandlePackage(pAddress, type, cid).send({ from: account })
        .once('receipt', () => {
          setLoading(false);
          setSubmitted(true);
        });
    } else {
      // Pure demo fallback
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1200);
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        borderRadius: '16px',
        padding: '40px 32px',
        textAlign: 'center',
        color: '#f8fafc',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <CheckCircleIcon style={{ color: '#4ade80', fontSize: 56, marginBottom: '16px' }} />
        <h2 style={{ color: '#4ade80', marginBottom: '8px' }}>Package Collected! ✓</h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Package <code style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '6px' }}>{pAddress.slice(0, 10)}...{pAddress.slice(-6)}</code> has been logged on the blockchain.
        </p>
        {selectedSample && (
          <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
            <p style={{ margin: '4px 0', color: '#cbd5e1' }}><b style={{ color: '#94a3b8' }}>Medicine:</b> {selectedSample.name}</p>
            <p style={{ margin: '4px 0', color: '#cbd5e1' }}><b style={{ color: '#94a3b8' }}>Route:</b> {selectedSample.from} → {selectedSample.to}</p>
            <p style={{ margin: '4px 0', color: '#38bdf8' }}><AcUnitIcon style={{ fontSize: 14, verticalAlign: 'middle' }} /> Cold-Chain: {selectedSample.temp} ✓ Optimal</p>
          </div>
        )}
        <Button
          variant="outlined"
          onClick={() => { setSubmitted(false); setpAddress(''); setCid(''); setSelectedSample(null); }}
          style={{ borderColor: '#475569', color: '#94a3b8', borderRadius: '10px', textTransform: 'none' }}
        >
          Handle Another Package
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <LocalShippingIcon style={{ color: '#fbbf24', fontSize: 28 }} />
          <Typography variant="h5" style={{ color: '#f8fafc', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
            Handle Package
          </Typography>
        </div>
        <Typography variant="body2" style={{ color: '#94a3b8' }}>
          Collect a pharmaceutical package and log it on the blockchain. The package status will update across all nodes in the supply chain.
        </Typography>
      </div>

      {/* Quick-select sample packages */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '20px',
      }}>
        <Typography variant="subtitle2" style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
          📦 Quick Select — Active Packages
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAMPLE_PACKAGES.map((pkg) => (
            <div
              key={pkg.address}
              onClick={() => handleSelectSample(pkg)}
              style={{
                background: selectedSample?.address === pkg.address ? 'rgba(251,191,36,0.1)' : 'rgba(15,23,42,0.5)',
                border: `1px solid ${selectedSample?.address === pkg.address ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '10px',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>{pkg.name}</p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>{pkg.address.slice(0,10)}...{pkg.address.slice(-6)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', color: '#94a3b8', fontSize: '0.78rem' }}>{pkg.from} → {pkg.to}</p>
                  <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
                    <AcUnitIcon style={{ fontSize: 12, verticalAlign: 'middle' }} /> {pkg.temp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '24px',
      }}>
        <Typography variant="subtitle2" style={{ color: '#94a3b8', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
          Package Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <TextField
              variant="outlined"
              fullWidth
              id="pAddress"
              label="Package Contract Address"
              value={pAddress}
              onChange={(e) => setpAddress(e.target.value)}
              placeholder="0x..."
              helperText="The Ethereum contract address of the raw material or medicine package"
              InputProps={{ style: { color: '#f8fafc', fontFamily: 'monospace' } }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              FormHelperTextProps={{ style: { color: '#475569' } }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <TextField
              variant="outlined"
              fullWidth
              id="type"
              label="Transport Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              helperText="1 = Supplier→Mfr, 2 = Mfr→Wholesaler"
              InputProps={{ style: { color: '#f8fafc' } }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              FormHelperTextProps={{ style: { color: '#475569' } }}
            />
            <TextField
              variant="outlined"
              fullWidth
              id="cid"
              label="Cold-Chain ID (CID)"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              placeholder="CID-XXXXXX"
              helperText="IoT sensor session identifier"
              InputProps={{ style: { color: '#f8fafc' } }}
              InputLabelProps={{ style: { color: '#94a3b8' } }}
              FormHelperTextProps={{ style: { color: '#475569' } }}
            />
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            style={{
              background: loading ? 'rgba(251,191,36,0.3)' : 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
              color: loading ? '#94a3b8' : '#0f172a',
              borderRadius: '12px',
              padding: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              fontFamily: "'Inter', sans-serif",
              boxShadow: loading ? 'none' : '0 4px 14px rgba(251,191,36,0.35)',
            }}
          >
            {loading ? 'Updating Blockchain...' : <><span role="img" aria-label="confirm">✓</span> Confirm Package Pickup</>}
          </Button>
        </form>
      </div>

      {/* IoT Simulator */}
      <div style={{
        marginTop: '24px',
        background: 'rgba(30, 41, 59, 0.9)',
        border: `1px solid ${isAlert ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '14px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {isAlert && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#ef4444', color: 'white', textAlign: 'center', padding: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            <WarningIcon style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }} /> 
            TEMPERATURE SPIKE DETECTED! SMART CONTRACT WILL REJECT PACKAGE
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: isAlert ? '20px' : '0' }}>
          <Typography variant="subtitle2" style={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
            Live IoT Telemetry
          </Typography>
          <span style={{ fontSize: '0.7rem', color: '#64748b', background: 'rgba(15,23,42,0.8)', padding: '2px 6px', borderRadius: '4px' }}>
            ⚠️ SIMULATION MODE
          </span>
        </div>
        
        <div style={{ height: '120px', width: '100%', position: 'relative', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 0' }}>
           {/* Simple SVG Line Chart */}
           <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
             {/* Target Zone (2-8 C is safe) */}
             <rect x="0" y="20" width="300" height="60" fill="rgba(16, 185, 129, 0.1)" />
             <polyline
               fill="none"
               stroke={isAlert ? '#ef4444' : '#38bdf8'}
               strokeWidth="2"
               points={tempData.map((d, i) => `${i * 10},${100 - (d.temp * 10)}`).join(' ')}
             />
           </svg>
           {/* Axis labels */}
           <div style={{ position: 'absolute', bottom: 4, left: 8, fontSize: '0.65rem', color: '#64748b' }}>-60s</div>
           <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: '0.65rem', color: '#64748b' }}>Now</div>
           <div style={{ position: 'absolute', top: 14, left: 8, fontSize: '0.65rem', color: '#64748b' }}>8°C Max</div>
        </div>

        <Button
          onClick={triggerAlert}
          fullWidth
          variant="outlined"
          style={{
            marginTop: '16px',
            color: '#ef4444',
            borderColor: 'rgba(239, 68, 68, 0.5)',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.85rem'
          }}
        >
          Simulate Hardware Failure (Spike)
        </Button>
      </div>
    </div>
  );
}
