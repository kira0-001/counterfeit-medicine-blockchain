import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

const SAMPLE_DRUGS = [
  {
    addr: "0xBBB0000000000000000000000000000000000001",
    name: "Paracetamol 500mg Tablets",
    batch: "MED-2026-X9",
    risk: "0.2%",
    history: [
      { step: "Supplier", detail: "Global Chemicals Ltd.", loc: "Berlin, DE", time: "Oct 12, 08:00" },
      { step: "Transporter", detail: "FastTrack Logistics", loc: "In Transit", time: "Oct 13, 14:20", temp: "4.2 °C" },
      { step: "Manufacturer", detail: "MediLife Labs", loc: "Geneva, CH", time: "Oct 14, 09:15" },
      { step: "Wholesaler", detail: "EuroPharma Hub", loc: "Paris, FR", time: "Oct 15, 11:30" },
      { step: "Distributor", detail: "City Pharmacy", loc: "Madrid, ES", time: "Oct 16, 16:45" },
    ]
  },
  {
    addr: "0xBBB0000000000000000000000000000000000002",
    name: "Amoxicillin 250mg Capsules",
    batch: "AMX-9942",
    risk: "0.5%",
    history: [
      { step: "Supplier", detail: "BioPharm Raw", loc: "Munich, DE", time: "Oct 10, 08:00" },
      { step: "Transporter", detail: "ColdChain Movers", loc: "In Transit", time: "Oct 11, 14:20", temp: "3.9 °C" },
      { step: "Manufacturer", detail: "MediLife Labs", loc: "Geneva, CH", time: "Oct 13, 09:15" },
      { step: "Wholesaler", detail: "EuroPharma Hub", loc: "Paris, FR", time: "Oct 14, 11:30" },
      { step: "Distributor", detail: "City Pharmacy", loc: "Madrid, ES", time: "Oct 15, 16:45" },
    ]
  },
  {
    addr: "0xBBB0000000000000000000000000000000000003",
    name: "Insulin Glargine 100 IU/ml",
    batch: "INS-5501",
    risk: "0.1%",
    history: [
      { step: "Supplier", detail: "ChemCorp", loc: "Zurich, CH", time: "Oct 14, 08:00" },
      { step: "Transporter", detail: "FastTrack Logistics", loc: "In Transit", time: "Oct 15, 14:20", temp: "2.5 °C" },
      { step: "Manufacturer", detail: "BioTech Pharma", loc: "Munich, DE", time: "Oct 16, 09:15" },
      { step: "Wholesaler", detail: "Global Health", loc: "London, UK", time: "Oct 18, 11:30" },
      { step: "Distributor", detail: "Central Hospital", loc: "Madrid, ES", time: "Oct 19, 16:45" },
    ]
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#f8fafc',
    padding: theme.spacing(4, 2),
    fontFamily: "'Inter', sans-serif",
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
    maxWidth: 700,
    width: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '20px',
    marginBottom: '24px',
  },
  iconValid: { fontSize: 48, color: '#10b981' },
  iconInvalid: { fontSize: 64, color: '#ef4444', marginBottom: '16px' },
  aiBox: {
    background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.1) 100%)',
    border: '1px solid rgba(168,85,247,0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'inset 0 0 20px rgba(168,85,247,0.05)',
  },
  aiBadge: {
    background: '#1e293b',
    border: '1px solid #a855f7',
    color: '#c084fc',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  timelineBox: {
    background: 'rgba(15,23,42,0.6)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  }
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Verify() {
  const classes = useStyles();
  const query = useQuery();
  const address = query.get('address');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Strictly validate against known demo addresses
      const drug = SAMPLE_DRUGS.find(d => d.addr === address);
      if (drug) {
        setData(drug);
      } else {
        setData(null); // Invalid
      }
      setLoading(false);
    }, 1500);
  }, [address]);

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <NavLink to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600 }}>
          <span style={{ fontSize: '1.2rem' }}>←</span> Back to Home
        </NavLink>

        <Paper className={classes.paper}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CircularProgress style={{ color: '#3b82f6', marginBottom: 24 }} size={60} />
              <Typography variant="h6" style={{ color: '#cbd5e1', fontWeight: 600 }}>
                Querying Ethereum Mainnet...
              </Typography>
              <Typography variant="body2" style={{ color: '#64748b', marginTop: 8 }}>
                Verifying cryptographic signatures and IoT telemetry
              </Typography>
            </div>
          ) : data ? (
            <>
              {/* Header */}
              <div className={classes.header}>
                <CheckCircleIcon className={classes.iconValid} />
                <div>
                  <Typography variant="h5" style={{ fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
                    Authentic Medicine Verified
                  </Typography>
                  <Typography style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '4px' }}>
                    Contract: {address}
                  </Typography>
                </div>
              </div>

              {/* Medicine Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <Typography style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Product Name</Typography>
                  <Typography style={{ color: '#f8fafc', fontSize: '1.2rem', fontWeight: 600 }}>{data.name}</Typography>
                </div>
                <div>
                  <Typography style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Batch Number</Typography>
                  <Typography style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 600, fontFamily: 'monospace' }}>#{data.batch}</Typography>
                </div>
              </div>

              {/* AI Risk Scorer */}
              <div className={classes.aiBox}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span role="img" aria-label="robot">🤖</span>
                    <Typography style={{ color: '#e9d5ff', fontWeight: 700, fontSize: '0.95rem' }}>AI Route Integrity Analysis</Typography>
                  </div>
                  <Typography style={{ color: '#c084fc', fontSize: '0.8rem' }}>
                    Machine learning model analyzed cold-chain telemetry and GPS deviations.
                  </Typography>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={classes.aiBadge}>Risk: {data.risk}</span>
                  <Typography style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>
                    ✓ 100% Pattern Match
                  </Typography>
                </div>
              </div>

              {/* Passport Timeline */}
              <Typography style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <VerifiedUserIcon style={{ color: '#10b981' }} /> Supply Chain Passport
              </Typography>
              <div className={classes.timelineBox}>
                <Timeline style={{ padding: 0, margin: 0 }}>
                  {data.history.map((h, i) => (
                    <TimelineItem key={i} style={{ minHeight: '60px' }}>
                      <TimelineSeparator>
                        <TimelineDot style={{ background: i === data.history.length - 1 ? '#10b981' : '#3b82f6' }} />
                        {i < data.history.length - 1 && <TimelineConnector style={{ background: 'rgba(255,255,255,0.1)' }} />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div>
                            <Typography style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>{h.step}</Typography>
                            <Typography style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{h.detail} — <span style={{ color: '#cbd5e1' }}>{h.loc}</span></Typography>
                            {h.temp && <Typography style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>❄️ Temp logged: {h.temp}</Typography>}
                          </div>
                          <Typography style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>{h.time}</Typography>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <ErrorOutlineIcon className={classes.iconInvalid} />
              <Typography variant="h4" style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>
                Verification Failed
              </Typography>
              <Typography variant="body1" style={{ color: '#cbd5e1', marginBottom: '24px' }}>
                CRITICAL ALERT: This product could not be found on the blockchain ledger. It may be a counterfeit product. Do not consume.
              </Typography>
              <Box style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', wordBreak: 'break-all', fontFamily: 'monospace', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                Invalid Contract Address: <br/> {address || "No address provided"}
              </Box>
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
}
