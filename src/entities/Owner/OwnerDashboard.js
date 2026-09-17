import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import SecurityIcon from "@material-ui/icons/Security";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    color: "#e2e8f0",
  },
  statCard: {
    background: "linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    backdropFilter: "blur(10px)",
    height: "100%",
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  chartCard: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "20px",
    marginTop: theme.spacing(3),
    height: "320px",
    display: "flex",
    flexDirection: "column"
  },
  barContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    flexGrow: 1,
    paddingTop: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "8px"
  },
  barCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40px"
  },
  bar: {
    width: "100%",
    borderRadius: "6px 6px 0 0",
    transition: "height 1s ease-out"
  }
}));

export default function OwnerDashboard() {
  const classes = useStyles();

  const mockLineData = [
    { day: "Mon", val: 30 }, { day: "Tue", val: 45 }, { day: "Wed", val: 65 }, 
    { day: "Thu", val: 50 }, { day: "Fri", val: 80 }, { day: "Sat", val: 100 }, { day: "Sun", val: 90 }
  ];

  const mockBarData = [
    { label: "Supp", val: 40, color: "#34d399" },
    { label: "Trans", val: 80, color: "#fbbf24" },
    { label: "Manuf", val: 30, color: "#f472b6" },
    { label: "Whole", val: 50, color: "#a855f7" },
    { label: "Dist", val: 95, color: "#38bdf8" }
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h4" style={{ fontWeight: 800, marginBottom: "8px", color: "#f8fafc" }}>
        Admin Analytics Command Center
      </Typography>
      <Typography variant="body1" style={{ color: "#94a3b8", marginBottom: "32px" }}>
        Real-time overview of the entire Ethereum pharmaceutical supply chain.
      </Typography>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        {[
          { title: "Total Medicines Tracked", value: "8,432", icon: <TimelineIcon />, color: "#38bdf8", bg: "rgba(56,189,248,0.15)" },
          { title: "Active Network Nodes", value: "32", icon: <SupervisorAccountIcon />, color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
          { title: "In-Transit Packages", value: "124", icon: <LocalShippingIcon />, color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
          { title: "Counterfeits Blocked", value: "14", icon: <SecurityIcon />, color: "#10b981", bg: "rgba(16,185,129,0.15)" }
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card className={classes.statCard}>
              <CardContent>
                <div className={classes.iconBox} style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <Typography variant="h3" style={{ fontWeight: 800, color: "#f8fafc", marginBottom: "4px" }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" style={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <div className={classes.chartCard}>
            <Typography variant="h6" style={{ color: "#f8fafc", fontWeight: 700 }}>
              Supply Chain Throughput (Last 7 Days)
            </Typography>
            <Typography variant="body2" style={{ color: "#94a3b8", marginBottom: "16px" }}>New batches registered on-chain</Typography>
            <div className={classes.barContainer}>
              {mockLineData.map((d, i) => (
                <div key={i} className={classes.barCol}>
                  <div className={classes.bar} style={{ height: `${d.val}%`, background: "linear-gradient(to top, rgba(56,189,248,0.2), #38bdf8)", boxShadow: "0 0 10px rgba(56,189,248,0.3)" }}></div>
                  <Typography style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "8px", fontWeight: 600 }}>{d.day}</Typography>
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={5}>
          <div className={classes.chartCard}>
            <Typography variant="h6" style={{ color: "#f8fafc", fontWeight: 700 }}>
              Registered Entities by Role
            </Typography>
            <Typography variant="body2" style={{ color: "#94a3b8", marginBottom: "16px" }}>Active nodes participating</Typography>
            <div className={classes.barContainer}>
              {mockBarData.map((d, i) => (
                <div key={i} className={classes.barCol}>
                  <div className={classes.bar} style={{ height: `${d.val}%`, background: d.color, boxShadow: `0 0 10px ${d.color}66` }}></div>
                  <Typography style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "8px", fontWeight: 600 }}>{d.label}</Typography>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
