import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import { NavLink, withRouter } from 'react-router-dom';

const ROLES = [
  { value: '/owner',       label: '🏛️  Admin (Owner)',      desc: 'Manage users & oversee the entire supply chain',   color: '#a855f7' },
  { value: '/supplier',    label: '🧪  Supplier',            desc: 'Register raw material batches on-chain',            color: '#38bdf8' },
  { value: '/transporter', label: '🚚  Transporter',         desc: 'Pick up & deliver packages between nodes',         color: '#fbbf24' },
  { value: '/manufacturer',label: '🏭  Manufacturer',        desc: 'Produce medicine & mint batch NFTs',               color: '#34d399' },
  { value: '/wholesaler',  label: '🏪  Wholesaler',          desc: 'Verify manufacturer signature & store inventory',   color: '#f472b6' },
  { value: '/distributor', label: '💊  Distributor',         desc: 'Receive verified drugs & distribute to pharmacies', color: '#fb923c' },
];

const SignIn = (props) => {
  const [role, setRole] = useState('/owner');
  const selected = ROLES.find(r => r.value === role) || ROLES[0];

  const handleSignIn = (e) => {
    e.preventDefault();
    props.history.push(role);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.10) 0%, transparent 60%), #0f172a',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Back to Home Link */}
        <NavLink to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#f8fafc'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
          <span style={{ fontSize: '1.2rem' }}>←</span> Back to Home
        </NavLink>

        {/* Card */}
        <div style={{
          width: '100%',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
        {/* Header gradient strip */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 100%)',
          padding: '32px 32px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          {/* Logo icon */}
          <div style={{ fontSize: '28px', textAlign:'center', lineHeight:'1' }}><span role="img" aria-label="pill">💊</span></div>
          <h1 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            PharmaChain DApp
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
            {props.isDemoMode
              ? '⚡ Demo Mode — No MetaMask needed. Select a role to explore.'
              : 'Select your supply chain role to enter your dashboard.'}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px 32px' }}>

          {/* Demo Mode badge */}
          {props.isDemoMode && (
            <div style={{
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span role="img" aria-label="warning" style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 500 }}>
                Read-Only Demo Mode — blockchain writes are simulated, no real transactions.
              </span>
            </div>
          )}

          {/* Role picker */}
          <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
            Supply Chain Role
          </label>
          <FormControl variant="outlined" style={{ width: '100%', marginBottom: '20px' }}>
            <Select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ color: '#f8fafc', background: 'rgba(30,41,59,0.7)', borderRadius: '10px' }}
              inputProps={{ style: { color: '#f8fafc' } }}
              MenuProps={{ PaperProps: { style: { background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } } }}
            >
              {ROLES.map(r => (
                <MenuItem key={r.value} value={r.value} style={{ color: '#f8fafc', paddingTop: '10px', paddingBottom: '10px' }}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selected role info card */}
          <div style={{
            background: `linear-gradient(135deg, ${selected.color}14, ${selected.color}06)`,
            border: `1px solid ${selected.color}30`,
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              background: selected.color,
              borderRadius: '50%',
              flexShrink: 0,
              boxShadow: `0 0 8px ${selected.color}`,
            }} />
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
              {selected.desc}
            </p>
          </div>

          {/* Enter button */}
          <button
            onClick={handleSignIn}
            style={{
              width: '100%',
              padding: '13px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 18px rgba(139,92,246,0.4)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 24px rgba(139,92,246,0.5)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 18px rgba(139,92,246,0.4)'; }}
          >
            Enter {selected.label.split('  ')[1] || ''} Dashboard →
          </button>

        </div>
      </div>
      </div>
    </div>
  );
};

export default withRouter(SignIn);
