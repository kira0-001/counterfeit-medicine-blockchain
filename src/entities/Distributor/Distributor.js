// import React, { Component } from 'react';
// import { NavLink, withRouter, BrowserRouter as Router, Route } from 'react-router-dom';
// import Header from '../../components/header/Header';
// import Button from '@material-ui/core/Button';

// class Distributor extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             clicked: false
//         }
//     }
//     handleClick() {
//         this.setState({
//             clicked: true
//         })
//         console.log("Clicked");
//     }

//     render() {
//         return (
//             <Router>
//                 <div style={{
//                     backgroundColor: "white",
//                     // backgroundImage: `url(${BackgroundImg})`,
//                     backgroundSize: "cover", backgroundRepeat: "no-repeat", height: '1000px',
//                 }}>
//                     <Header />
//                     <div className="body-container">
//                         <h3 style={{ textAlign: "center", color: "black" }}>Welcome Distributor!</h3>
//                         <Button variant="contained" color="primary" onClick={() => this.handleClick()}>View Received Medicine</Button>
//                         {/* <Button variant="contained" color="primary" onClick={()=>{this.props.history.push('/transporter/handle-package')}}>Handle Package</Button>   */}
//                     </div>
//                 </div>
//             </Router>
//         );
//     }
// }
// export default withRouter(Distributor);

import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../../main_dashboard/components/Navbars/Navbar";
import Sidebar from "../../main_dashboard/components/Sidebar/Sidebar.js";

import styles from "../../main_dashboard/assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "../../main_dashboard/assets/img/sidebar-2.jpg";
import logo from "../../main_dashboard/assets/img/reactlogo.png";
import mainBgImage from "../../components/images/distributor.jpg";

import ViewItem from "@material-ui/icons/ViewList";
import ViewTrans from "@material-ui/icons/Visibility";

import DistributorReceiveProduct from "./DistributorReceiveProduct";
import ViewResponses from "../Events/ViewResponses";
import RequestProductDistributor from "./RequestProduct";
import DistributorViewReceivedMedicines from "./DistributorViewReceivedMedicines";
import DistributorMedicineInfo from "./DistributorMedicineInfo";
import ViewRequests from "../Events/ViewRequests";
import ViewTransactions from "../Transactions/ViewTransactions";

// import routes from './ownerRoutes.js';

let ps;

const routes = [
  {
    path: "/request-product",
    name: "Request Product",
    icon: ViewItem,
    component: RequestProductDistributor,
    layout: "/distributor",
  },
  {
    path: "/view-responses",
    name: "View Response",
    icon: ViewTrans,
    component: ViewResponses,
    layout: "/distributor",
  },
  {
    path: "/receive-medicine",
    name: "Receive Medicine",
    icon: ViewTrans,
    component: DistributorReceiveProduct,
    layout: "/distributor",
  },
  {
    path: "/view-medicines",
    name: "View Medicines",
    icon: ViewItem,
    component: DistributorViewReceivedMedicines,
    layout: "/distributor",
  },
];

const useStyles = makeStyles(styles);

export default function Distributor({ ...rest }) {
  const switchRoutes = (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/distributor") {
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

      <Route
        exact
        path="/distributor/view-medicine/:id"
        render={(routeProps) => (
          <DistributorMedicineInfo
            account={rest.account}
            supplyChain={rest.supplyChain}
            web3={rest.web3}
            {...routeProps}
          />
        )}
      />
      <Route
        exact
        path="/distributor/view-request/:id"
        render={(routeProps) => (
          <ViewRequests
            account={rest.account}
            supplyChain={rest.supplyChain}
            web3={rest.web3}
            {...routeProps}
          />
        )}
      />
      <Route
        exact
        path="/distributor/view-transaction/:id"
        render={(routeProps) => (
          <ViewTransactions
            account={rest.account}
            supplyChain={rest.supplyChain}
            web3={rest.web3}
            {...routeProps}
          />
        )}
      />
      <Redirect from="/distributor" to="/distributor/request-product" />
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
    return window.location.pathname !== "/distributor/maps";
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
        logoText={"Distributor"}
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
