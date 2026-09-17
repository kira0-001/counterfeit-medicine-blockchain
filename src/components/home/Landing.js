import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Button, Card, CardContent, Grid, TextField, InputAdornment, Divider } from '@material-ui/core';
import RoleCards from '../cards/Cards';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import SearchIcon from '@material-ui/icons/Search';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TimelineIcon from '@material-ui/icons/Timeline';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import InfoIcon from '@material-ui/icons/Info';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'dashboards', label: 'Role Dashboards', icon: DashboardIcon, color: '#3b82f6' },
  { id: 'simulator', label: 'Live Simulator', icon: TimelineIcon, color: '#a855f7' },
  { id: 'audit', label: 'Authenticity Audit', icon: FindInPageIcon, color: '#10b981' },
  { id: 'about', label: 'About This Project', icon: InfoIcon, color: '#f59e0b' },
];

const SIMULATION_STAGES = [
  {
    step: 1, role: "Supplier", location: "Berlin, Germany",
    title: "1. Raw Material Registration",
    details: "Global Chemicals Ltd. registers 500kg Active Pharma Ingredient (Paracetamol) on the blockchain.",
    txHash: "0x9b8f887b4b1234567890abcdef1234567890abcdef1234567890abcdef123456",
    temp: "4.2 °C", status: "Verified & Minted"
  },
  {
    step: 2, role: "Transporter", location: "Transit via Air Cargo",
    title: "2. Cold-Chain Logistics Pickup",
    details: "FastTrack Logistics picks up container. IoT GPS & temperature sensor logs live status.",
    txHash: "0x8a7e776a3c0987654321fedcba0987654321fedcba0987654321fedcba098765",
    temp: "3.8 °C (Optimal)", status: "In Transit"
  },
  {
    step: 3, role: "Manufacturer", location: "Geneva, Switzerland",
    title: "3. Medicine Batch Production",
    details: "MediLife Labs processes raw ingredient into 10,000 Boxes of Paracetamol 500mg.",
    txHash: "0x7f6e554d3c2b1a0987654321fedcba0987654321fedcba0987654321fedcba09",
    temp: "4.0 °C", status: "Batch Produced & Sealed"
  },
  {
    step: 4, role: "Wholesaler", location: "Paris, France",
    title: "4. Warehouse Verification",
    details: "EuroPharma Wholesale verifies manufacturer ECDSA signature & stores shipment.",
    txHash: "0x6e5d443c2b1a0987654321fedcba0987654321fedcba0987654321fedcba0987",
    temp: "4.1 °C", status: "Wholesale Verified"
  },
  {
    step: 5, role: "Distributor", location: "Madrid, Spain",
    title: "5. Pharmacy & Customer Delivery",
    details: "City Health Distributors receives batch. Pharmacy scans QR code for authenticity audit.",
    txHash: "0x5d4c332b1a0987654321fedcba0987654321fedcba0987654321fedcba098765",
    temp: "4.2 °C", status: "Authentic & Delivered"
  }
];

const SAMPLE_DRUGS = [
  {
    id: 1, label: '💊 Paracetamol 500mg', addr: "0xBBB0000...0001",
    name: "Paracetamol 500mg Tablets (Batch #MED-2026-X9)",
    manufacturer: "MediLife Labs (Geneva, Switzerland)",
    wholesaler: "EuroPharma Wholesale (Paris, France)",
    distributor: "City Health Distributors (Madrid, Spain)",
    quantity: "10,000 Boxes", temp: "4.2 °C (Optimal Cold Chain)",
    txHash: "0x9b8f887b4b1234567890abcdef1234567890abcdef1234567890abcdef123456",
    status: "AUTHENTIC & VERIFIED ON ETHEREUM", color: '#38bdf8'
  },
  {
    id: 2, label: '💊 Amoxicillin 250mg', addr: "0xBBB0000...0002",
    name: "Amoxicillin 250mg Capsules (Batch #AMX-9942)",
    manufacturer: "MediLife Labs (Geneva, Switzerland)",
    wholesaler: "EuroPharma Wholesale (Paris, France)",
    distributor: "City Health Distributors (Madrid, Spain)",
    quantity: "5,000 Packs", temp: "3.9 °C (Optimal Cold Chain)",
    txHash: "0x8a7e776a3c0987654321fedcba0987654321fedcba0987654321fedcba098765",
    status: "AUTHENTIC & VERIFIED ON ETHEREUM", color: '#a855f7'
  },
  {
    id: 3, label: '💉 Insulin Glargine', addr: "0xBBB0000...0003",
    name: "Insulin Glargine 100 IU/ml (Batch #INS-5501)",
    manufacturer: "BioTech Pharma (Munich, Germany)",
    wholesaler: "Global Health Supply (London, UK)",
    distributor: "Central Hospital Pharmacy (Madrid, Spain)",
    quantity: "2,500 Vials", temp: "2.5 °C (Cold Chain Monitored)",
    txHash: "0x7f6e554d3c2b1a0987654321fedcba0987654321fedcba0987654321fedcba09",
    status: "AUTHENTIC & VERIFIED ON ETHEREUM", color: '#4ade80'
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #0d1424 100%)',
    color: '#e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
  },
  hero: {
    background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.18) 0%, rgba(15,23,42,0) 70%)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: theme.spacing(4, 3, 3, 3),
    textAlign: 'center',
    position: 'relative',
  },
  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(59,130,246,0.12)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '999px',
    padding: '4px 16px',
    fontSize: '0.78rem',
    color: '#60a5fa',
    fontWeight: 600,
    marginBottom: '16px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontWeight: 900,
    fontSize: '2.8rem',
    lineHeight: 1.15,
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #f8fafc 30%, #60a5fa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: { fontSize: '2rem' },
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: '1rem',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.7,
  },
  layout: {
    display: 'flex',
    flex: 1,
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: { flexDirection: 'column', padding: theme.spacing(2) },
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: '100%' },
  },
  sidebarCard: {
    background: 'rgba(30,41,59,0.7)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: theme.spacing(2),
    position: 'sticky',
    top: '80px',
    backdropFilter: 'blur(10px)',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginBottom: '4px',
    transition: 'all 0.2s ease',
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: 500,
    border: '1px solid transparent',
    '&:hover': {
      background: 'rgba(255,255,255,0.05)',
      color: '#f8fafc',
    },
  },
  navItemActive: {
    color: '#f8fafc',
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  navDot: {
    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  panel: {
    animation: '$fadeIn 0.25s ease',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(8px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  sectionHeader: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: '1.6rem',
    color: '#f8fafc',
    fontFamily: "'Inter', sans-serif",
  },
  sectionSub: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  stepCircle: {
    width: '44px', height: '44px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', margin: '0 auto 6px auto', transition: 'all 0.3s ease',
    fontSize: '1rem',
  },
  activeStep: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
    color: '#fff', boxShadow: '0 0 20px rgba(168,85,247,0.5)', transform: 'scale(1.15)',
  },
  completedStep: { background: '#10b981', color: '#fff' },
  upcomingStep: { background: '#1e293b', color: '#475569', border: '1px solid #334155' },
}));

export default function Landing() {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState('dashboards');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchAddr, setSearchAddr] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);

  useEffect(() => {
    let timer;
    if (isSimulating && currentStep > 0 && currentStep < 5) {
      timer = setTimeout(() => setCurrentStep((p) => p + 1), 2000);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, currentStep]);

  const startSim = () => { setIsSimulating(true); setCurrentStep(1); };
  const resetSim = () => { setIsSimulating(false); setCurrentStep(0); };

  const handleVerify = (drug) => {
    setVerifiedData(drug);
  };

  const activeStage = currentStep > 0 ? SIMULATION_STAGES[currentStep - 1] : null;
  const progress = currentStep === 0 ? 0 : (currentStep / 5) * 100;

  return (
    <div className={classes.root}>
      {/* ── Hero ── */}
      <div className={classes.hero}>
        <div className={classes.heroTag}>
          <span>🔗</span> Blockchain · Ethereum · IoT · React
        </div>
        <Typography className={classes.heroTitle}>
          Pharma Anti-Counterfeit<br />Supply Chain Platform
        </Typography>
        <Typography className={classes.heroSub}>
          Every medicine tracked from raw ingredient to pharmacy shelf — immutably recorded on Ethereum.
          One QR scan proves authenticity.
        </Typography>
        <Box style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/signin"
            variant="contained"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              color: '#fff', fontWeight: 700, borderRadius: '12px',
              padding: '10px 28px', textTransform: 'none', fontSize: '0.95rem',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            🚀 Enter Demo
          </Button>
          <Button
            onClick={() => setActiveTab('simulator')}
            variant="outlined"
            style={{
              borderColor: 'rgba(255,255,255,0.2)', color: '#cbd5e1',
              borderRadius: '12px', padding: '10px 24px',
              textTransform: 'none', fontSize: '0.95rem',
            }}
          >
            ⚡ Watch Live Simulation
          </Button>
        </Box>
      </div>

      {/* ── Sidebar + Content Layout ── */}
      <div className={classes.layout}>

        {/* Sidebar */}
        <div className={classes.sidebar}>
          <div className={classes.sidebarCard}>
            <Typography style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', paddingLeft: '4px' }}>
              Navigation
            </Typography>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${classes.navItem} ${isActive ? classes.navItemActive : ''}`}
                  style={isActive ? { background: `rgba(${item.color === '#3b82f6' ? '59,130,246' : item.color === '#a855f7' ? '168,85,247' : item.color === '#10b981' ? '16,185,129' : '245,158,11'},0.1)` } : {}}
                >
                  <span className={classes.navDot} style={{ background: isActive ? item.color : 'transparent', border: isActive ? 'none' : '1px solid #475569' }} />
                  <Icon style={{ fontSize: '18px', color: isActive ? item.color : '#64748b' }} />
                  <span style={{ color: isActive ? item.color : '#94a3b8' }}>{item.label}</span>
                </div>
              );
            })}

            <Divider style={{ background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

            <Typography style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', paddingLeft: '4px' }}>
              Quick Access
            </Typography>
            {[
              { label: '🏭 Supplier', to: '/supplier' },
              { label: '🚚 Transporter', to: '/transporter' },
              { label: '⚗️ Manufacturer', to: '/manufacturer' },
              { label: '🏪 Wholesaler', to: '/wholesaler' },
              { label: '📦 Distributor', to: '/distributor' },
              { label: '🔐 Owner / Admin', to: '/owner' },
            ].map((r) => (
              <Button
                key={r.to}
                component={Link}
                to={r.to}
                fullWidth
                style={{
                  justifyContent: 'flex-start', textTransform: 'none', color: '#64748b',
                  fontSize: '0.82rem', padding: '5px 10px', marginBottom: '2px',
                  borderRadius: '8px',
                }}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={classes.content}>

          {/* ── PANEL: ROLE DASHBOARDS ── */}
          {activeTab === 'dashboards' && (
            <div className={classes.panel}>
              <div className={classes.sectionHeader}>
                <Typography className={classes.sectionTitle}>🚀 Role Dashboards</Typography>
                <Typography className={classes.sectionSub}>
                  Select your role to enter its dashboard. Each role has a unique set of permissions on the blockchain.
                </Typography>
              </div>
              <RoleCards />
            </div>
          )}

          {/* ── PANEL: LIVE SIMULATOR ── */}
          {activeTab === 'simulator' && (
            <div className={classes.panel}>
              <div className={classes.sectionHeader}>
                <Typography className={classes.sectionTitle}>⚡ Interactive Live Supply Chain Simulator</Typography>
                <Typography className={classes.sectionSub}>
                  Watch a real medicine batch travel across 5 blockchain nodes — from raw material to pharmacy.
                </Typography>
              </div>

              <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '16px', padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <Typography style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem' }}>Batch: Paracetamol 500mg — 10,000 Units</Typography>
                    <Typography style={{ color: '#64748b', fontSize: '0.85rem' }}>Manufacturer: MediLife Labs, Geneva</Typography>
                  </div>
                  {!isSimulating ? (
                    <Button variant="contained" onClick={startSim} startIcon={<PlayArrowIcon />}
                      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', padding: '10px 24px', boxShadow: '0 4px 14px rgba(139,92,246,0.4)' }}>
                      Run Live Simulation
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={resetSim} startIcon={<RefreshIcon />}
                      style={{ borderColor: '#475569', color: '#94a3b8', borderRadius: '12px', textTransform: 'none' }}>
                      Reset
                    </Button>
                  )}
                </div>

                {/* Stepper */}
                <Grid container spacing={1} style={{ marginBottom: '20px', textAlign: 'center' }}>
                  {SIMULATION_STAGES.map((s) => {
                    const isCurrent = currentStep === s.step;
                    const isDone = currentStep > s.step;
                    let cls = classes.upcomingStep;
                    if (isCurrent) cls = classes.activeStep;
                    if (isDone) cls = classes.completedStep;
                    return (
                      <Grid item xs style={{ flexGrow: 1 }} key={s.step}>
                        <div className={`${classes.stepCircle} ${cls}`}>
                          {isDone ? <CheckCircleIcon fontSize="small" /> : s.step}
                        </div>
                        <Typography style={{ color: isCurrent ? '#38bdf8' : isDone ? '#4ade80' : '#475569', fontSize: '0.78rem', fontWeight: isCurrent ? 700 : 400 }}>
                          {s.role}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Map Tracker Visual */}
                <div style={{ position: 'relative', height: '120px', background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 100%)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)', marginBottom: '24px', overflow: 'hidden' }}>
                  {/* Grid background */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Base Route Line */}
                  <svg style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '40px', transform: 'translateY(-50%)', overflow: 'visible' }}>
                    <line x1="10%" y1="20px" x2="90%" y2="20px" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="8 8" />
                    
                    {/* Active Route Line */}
                    <line x1="10%" y1="20px" x2={`${10 + (progress * 0.8)}%`} y2="20px" stroke="#38bdf8" strokeWidth="4" 
                          style={{ transition: 'x2 1s ease-in-out', filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.8))' }} />
                  </svg>
                  
                  {/* City Nodes */}
                  {['Berlin', 'Transit', 'Geneva', 'Paris', 'Madrid'].map((city, idx) => (
                    <div key={city} style={{ position: 'absolute', left: `${10 + (idx * 20)}%`, top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ 
                        width: '16px', height: '16px', borderRadius: '50%', 
                        background: currentStep > idx ? '#4ade80' : currentStep === idx + 1 ? '#38bdf8' : '#1e293b',
                        border: `3px solid ${currentStep > idx ? '#10b981' : currentStep === idx + 1 ? '#e0f2fe' : '#475569'}`,
                        transition: 'all 0.5s ease',
                        boxShadow: currentStep === idx + 1 ? '0 0 15px #38bdf8' : 'none'
                      }}></div>
                      <Typography style={{ color: currentStep >= idx + 1 ? '#f8fafc' : '#64748b', fontSize: '0.7rem', fontWeight: 700, marginTop: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {city}
                      </Typography>
                    </div>
                  ))}

                  {/* Moving Pulsing Dot (The Package) */}
                  {currentStep > 0 && currentStep <= 5 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: `${10 + ((currentStep - 1) * 20)}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '24px', height: '24px',
                      background: 'rgba(56,189,248,0.4)', borderRadius: '50%',
                      animation: 'pulse 1.5s infinite',
                      transition: 'left 1s ease-in-out',
                      pointerEvents: 'none'
                    }}>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', background: '#38bdf8', borderRadius: '50%' }}></div>
                    </div>
                  )}
                </div>
                <style>{`
                  @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
                  }
                `}</style>

                {activeStage ? (
                  <Card style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '14px', color: '#fff' }}>
                    <CardContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                        <Typography variant="h6" style={{ color: '#38bdf8', fontWeight: 700 }}>{activeStage.title}</Typography>
                        <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {activeStage.status}
                        </span>
                      </div>
                      <Typography style={{ color: '#cbd5e1', marginBottom: '16px' }}>{activeStage.details}</Typography>
                      <Grid container spacing={2} style={{ background: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '10px' }}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" style={{ color: '#64748b', display: 'block' }}>Location Node</Typography>
                          <Typography style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <LocalShippingIcon fontSize="small" style={{ color: '#a855f7' }} /> {activeStage.location}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" style={{ color: '#64748b', display: 'block' }}>IoT Sensor Temp</Typography>
                          <Typography style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AcUnitIcon fontSize="small" /> {activeStage.temp}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" style={{ color: '#64748b', display: 'block' }}>Blockchain Tx Hash</Typography>
                          <Typography style={{ fontFamily: 'monospace', color: '#60a5fa', fontSize: '0.85rem' }}>
                            {activeStage.txHash.substring(0, 20)}...
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#475569', background: 'rgba(15,23,42,0.3)', borderRadius: '12px', border: '1px dashed #334155' }}>
                    <TimelineIcon style={{ fontSize: 40, marginBottom: '8px', opacity: 0.4 }} />
                    <Typography>Click <b style={{ color: '#a855f7' }}>Run Live Simulation</b> to watch the blockchain in action!</Typography>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PANEL: AUTHENTICITY AUDIT ── */}
          {activeTab === 'audit' && (
            <div className={classes.panel}>
              <div className={classes.sectionHeader}>
                <Typography className={classes.sectionTitle}>🔍 Instant Drug Authenticity Audit Tool</Typography>
                <Typography className={classes.sectionSub}>
                  Select a sample drug batch or enter a contract address to audit its full blockchain history.
                </Typography>
              </div>

              <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '28px' }}>
                {/* Sample buttons */}
                <Typography style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  Select a Sample Batch:
                </Typography>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {SAMPLE_DRUGS.map((d) => (
                    <Button key={d.id} variant="outlined" size="small"
                      onClick={() => { setSearchAddr(d.addr); handleVerify(d); }}
                      style={{ borderColor: d.color, color: d.color, borderRadius: '20px', textTransform: 'none', fontWeight: 600, padding: '5px 16px', fontSize: '0.82rem' }}>
                      {d.label}
                    </Button>
                  ))}
                </div>

                {/* Manual input */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <TextField variant="outlined" fullWidth value={searchAddr}
                    onChange={(e) => setSearchAddr(e.target.value)}
                    placeholder="Enter Medicine Contract Address or Batch ID..."
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon style={{ color: '#64748b' }} /></InputAdornment>,
                      style: { color: '#fff', borderRadius: '12px' }
                    }}
                    style={{ flexGrow: 1 }}
                  />
                  <Button variant="contained" size="large"
                    onClick={() => { const match = SAMPLE_DRUGS.find(d => d.addr === searchAddr || searchAddr.includes('1')); if (match) handleVerify(match); else handleVerify(SAMPLE_DRUGS[0]); }}
                    startIcon={<VerifiedUserIcon />}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 700, borderRadius: '12px', whiteSpace: 'nowrap', textTransform: 'none', padding: '12px 24px' }}>
                    Verify Now
                  </Button>
                </div>

                {/* Result */}
                {verifiedData && (
                  <Card style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid #10b981', borderRadius: '16px', color: '#fff' }}>
                    <CardContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '12px', padding: '10px', display: 'flex' }}>
                            <VerifiedUserIcon style={{ color: '#4ade80', fontSize: 28 }} />
                          </div>
                          <div>
                            <Typography variant="h6" style={{ fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>{verifiedData.name}</Typography>
                            <Typography style={{ color: '#64748b', fontSize: '0.78rem', fontFamily: 'monospace' }}>Contract: {verifiedData.addr}</Typography>
                          </div>
                        </div>
                        <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          ✓ AUTHENTIC
                        </span>
                      </div>

                      <Grid container spacing={3} style={{ alignItems: 'flex-start' }}>
                        <Grid item xs={12} sm={8}>
                          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '12px', padding: '16px' }}>
                            {[
                              ['🏭 Manufacturer', verifiedData.manufacturer],
                              ['🏪 Wholesaler Hub', verifiedData.wholesaler],
                              ['📦 Distributor', verifiedData.distributor],
                              ['📊 Batch Quantity', verifiedData.quantity],
                              ['🌡️ IoT Cold-Chain', verifiedData.temp],
                            ].map(([k, v]) => (
                              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: '4px' }}>
                                <Typography style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{k}</Typography>
                                <Typography style={{ color: '#cbd5e1', fontSize: '0.85rem', textAlign: 'right' }}>{v}</Typography>
                              </div>
                            ))}
                            <Typography style={{ color: '#475569', fontFamily: 'monospace', fontSize: '0.75rem', marginTop: '12px', wordBreak: 'break-all' }}>
                              Txn: {verifiedData.txHash}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
                          <div style={{ background: '#fff', padding: '14px', borderRadius: '14px', display: 'inline-block' }}>
                            <QRCodeSVG value={`${window.location.origin}/verify?address=${verifiedData.addr}`} size={140} level="H" />
                          </div>
                          <Typography style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '8px' }}>
                            Scan to verify on blockchain
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ── PANEL: ABOUT ── */}
          {activeTab === 'about' && (
            <div className={classes.panel}>
              <div className={classes.sectionHeader}>
                <Typography className={classes.sectionTitle}>📖 About This Project</Typography>
                <Typography className={classes.sectionSub}>
                  A complete technical overview and guide for demonstrating this platform.
                </Typography>
              </div>

              <Grid container spacing={3}>
                {/* What It Does */}
                <Grid item xs={12}>
                  <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px', padding: '28px' }}>
                    <Typography style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px' }}>
                      💡 What Does This Project Do?
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { n: '1', t: 'Tracks Every Journey', d: 'Every handoff — Supplier → Manufacturer → Wholesaler → Distributor — is permanently written onto immutable Ethereum smart contracts. No one can delete or alter the record.', c: '#3b82f6' },
                        { n: '2', t: 'IoT Cold-Chain Monitoring', d: 'Monitors real-time temperature telemetry (2°C–8°C) ensuring sensitive drugs like insulin or vaccines don\'t spoil in transit. Any breach triggers an immediate alert.', c: '#06b6d4' },
                        { n: '3', t: 'QR Authenticity Verification', d: 'Enables pharmacies and patients to scan a simple QR code on the packaging to instantly verify if a drug is 100% authentic and untampered.', c: '#10b981' },
                      ].map((item) => (
                        <Grid item xs={12} md={4} key={item.n}>
                          <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '12px', padding: '20px', height: '100%', borderTop: `3px solid ${item.c}` }}>
                            <div style={{ width: '28px', height: '28px', background: item.c, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{item.n}</div>
                            <Typography style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>{item.t}</Typography>
                            <Typography style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.d}</Typography>
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>

                {/* Who Can Use This */}
                <Grid item xs={12} md={6}>
                  <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '16px', padding: '24px', height: '100%' }}>
                    <Typography style={{ color: '#a855f7', fontWeight: 800, fontSize: '1rem', marginBottom: '16px' }}>👥 Who Can Use This?</Typography>
                    {[
                      ['🏭', 'Pharmaceutical Companies', 'Track your own supply chain end-to-end as a B2B SaaS tool'],
                      ['🏥', 'Hospital Procurement Officers', 'Verify medicines before purchase haven\'t been tampered with'],
                      ['💊', 'Pharmacists & Distributors', 'Check authenticity of every box before dispensing to patients'],
                      ['🕵️', 'Drug Regulatory Authorities', 'Audit supply chains and detect counterfeit batches instantly'],
                    ].map(([icon, title, desc]) => (
                      <div key={title} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                        <div>
                          <Typography style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>{title}</Typography>
                          <Typography style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>{desc}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </Grid>

                {/* How to Demo */}
                <Grid item xs={12} md={6}>
                  <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '24px', height: '100%' }}>
                    <Typography style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1rem', marginBottom: '16px' }}>🎯 How to Demo This Project</Typography>
                    {[
                      ['1', 'Click "Enter Demo" button on this page — pick any role'],
                      ['2', 'As Owner/Admin: Add a new Supplier or Manufacturer user'],
                      ['3', 'As Supplier: Register a new Raw Material batch'],
                      ['4', 'As Transporter: Pick up the package, watch the IoT chart'],
                      ['5', 'As Manufacturer: Create medicine batch — see the QR Code generate!'],
                      ['6', 'Use the Audit Tool (left sidebar) to verify the final product'],
                    ].map(([n, step]) => (
                      <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                        <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{n}</span>
                        <Typography style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>{step}</Typography>
                      </div>
                    ))}
                  </div>
                </Grid>

                {/* Tech Stack */}
                <Grid item xs={12}>
                  <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
                    <Typography style={{ color: '#94a3b8', fontWeight: 800, fontSize: '1rem', marginBottom: '16px' }}>🛠 Technology Stack</Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {[
                        { t: 'Ethereum', c: '#627eea' }, { t: 'Solidity Smart Contracts', c: '#627eea' },
                        { t: 'Web3.js', c: '#f6851b' }, { t: 'React.js', c: '#61dafb' },
                        { t: 'Material UI', c: '#007fff' }, { t: 'IoT Telemetry Sim', c: '#10b981' },
                        { t: 'QR Code Auth', c: '#4ade80' }, { t: 'Truffle / Ganache', c: '#5f464d' },
                      ].map((tech) => (
                        <span key={tech.t} style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${tech.c}40`, color: tech.c, padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                          {tech.t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}