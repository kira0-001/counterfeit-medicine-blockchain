import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Grid, Box } from "@material-ui/core";
import { NavLink } from "react-router-dom";

// Icons
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import StorefrontIcon from '@material-ui/icons/Storefront';
import BusinessIcon from '@material-ui/icons/Business';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

const useStyles = makeStyles({
  cardGrid: {
    padding: '20px 0',
  },
  glowCard: {
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    height: '100%',
    color: '#fff',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: '#38bdf8',
    }
  },
  cardAction: {
    padding: '32px 24px',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const roleCards = [
  {
    title: 'Administrator',
    desc: 'Verify system participants, manage roles, and review security logs.',
    path: '/owner',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    icon: <SupervisorAccountIcon style={{ fontSize: 44 }} />
  },
  {
    title: 'Supplier',
    desc: 'Register raw chemical ingredients & dispatch to manufacturers.',
    path: '/supplier',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)',
    icon: <ViewModuleIcon style={{ fontSize: 44 }} />
  },
  {
    title: 'Transporter',
    desc: 'Track GPS locations & IoT temperature sensors during transit.',
    path: '/transporter',
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.15)',
    icon: <LocalShippingIcon style={{ fontSize: 44 }} />
  },
  {
    title: 'Manufacturer',
    desc: 'Formulate drug batches, mint smart contracts & print QR codes.',
    path: '/manufacturer',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.15)',
    icon: <BusinessIcon style={{ fontSize: 44 }} />
  },
  {
    title: 'Wholesaler',
    desc: 'Receive bulk shipments, verify signatures & manage warehouse hubs.',
    path: '/wholesaler',
    color: '#facc15',
    bg: 'rgba(250, 204, 21, 0.15)',
    icon: <StorefrontIcon style={{ fontSize: 44 }} />
  },
  {
    title: 'Distributor',
    desc: 'Distribute authentic medicine to pharmacies, clinics & customers.',
    path: '/distributor',
    color: '#fb7185',
    bg: 'rgba(251, 113, 133, 0.15)',
    icon: <VerifiedUserIcon style={{ fontSize: 44 }} />
  }
];

function Cards() {
  const classes = useStyles();

  return (
    <Grid container spacing={4} className={classes.cardGrid}>
      {roleCards.map((role, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <NavLink to={role.path} style={{ textDecoration: 'none' }}>
            <Card className={classes.glowCard} elevation={0}>
              <CardActionArea className={classes.cardAction}>
                <Box className={classes.iconBox} style={{ backgroundColor: role.bg, color: role.color }}>
                  {role.icon}
                </Box>
                <CardContent style={{ padding: 0 }}>
                  <Typography variant="h5" component="h2" style={{ fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" style={{ color: '#94a3b8', lineHeight: 1.5 }}>
                    {role.desc}
                  </Typography>
                  <Box style={{
                    marginTop: 20,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: role.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}>
                    Enter Dashboard →
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </NavLink>
        </Grid>
      ))}
    </Grid>
  );
}

export default Cards;
