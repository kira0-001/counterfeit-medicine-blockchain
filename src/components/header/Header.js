import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    background: "#0f172a",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  },
  title: {
    flexGrow: 1,
    fontWeight: 800,
    letterSpacing: "1px",
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  loginBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "#fff",
    padding: "6px 20px",
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: "bold",
    boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(139, 92, 246, 0.23)",
      background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    }
  }
}));

function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <span role="img" aria-label="pill">💊</span> PharmaChain
          </Typography>
          <Button href="/signin" className={classes.loginBtn}>
            Demo Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
