import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../main_dashboard/components/Navbars/Navbar";
import Sidebar from "../../main_dashboard/components/Sidebar/Sidebar.js";
import styles from "../../main_dashboard/assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "../../main_dashboard/assets/img/sidebar-2.jpg";
import mainBgImage from "../../components/images/admin.jpg";
import logo from "../../main_dashboard/assets/img/reactlogo.png";
import AddItem from "@material-ui/icons/AddBox";
import ViewItem from "@material-ui/icons/ViewList";
import AddNewUser from "./AddNewUser";
import ViewUser from "./ViewUser";
import OwnerDashboard from "./OwnerDashboard";
import DashboardIcon from "@material-ui/icons/Dashboard";

let ps;

const routes = [
  {
    path: "/dashboard",
    name: "Analytics Dashboard",
    icon: DashboardIcon,
    component: OwnerDashboard,
    layout: "/owner",
  },
  {
    path: "/add-new-user",
    name: "Add New User",
    icon: AddItem,
    component: AddNewUser,
    layout: "/owner",
  },
  {
    path: "/view-user",
    name: "View User",
    icon: ViewItem,
    component: ViewUser,
    layout: "/owner",
  },
];

const useStyles = makeStyles(styles);

export default function Owner({ ...rest }) {
  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/owner") {
          return (
            <Route
              path={prop.layout + prop.path}
              render={() => (
                <prop.component
                  account={rest.account}
                  supplyChain={rest.supplyChain}
                  web3={rest.web3}
                />
              )}
              key={key}
            />
          );
        }
        return null;
      })}
      <Redirect from="/owner" to="/owner/dashboard" />
    </Switch>
  );
  const classes = useStyles();
  const mainPanel = React.createRef();
  const image = bgImage;
  const color = "blue";
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/owner/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.style.overflow = "auto";
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Owner"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel} style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url(${mainBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />

        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes}</div>
        )}
      </div>
    </div>
  );
}
