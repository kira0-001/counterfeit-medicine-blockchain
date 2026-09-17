// Import React
import React, { Component } from 'react';

// Web3 & Blockchain imports
import Web3 from 'web3';
import SupplyChain from './build/SupplyChain.json';

// Role Component Imports
import Owner from './entities/Owner/Owner';
import Supplier from './entities/Supplier/Supplier';
import Transporter from './entities/Transporter/Transporter';
import Manufacturer from './entities/Manufacturer/Manufacturer';
import Wholesaler from './entities/Wholesaler/Wholesaler';
import Distributor from './entities/Distributor/Distributor';
import Verify from './components/Verify';

// Utils & Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignIn from './components/login/SignIn';
import SignUp from './components/login/SignUp';
import Landing from './components/home/Landing';
import Loader from './components/Loader';
import NotFound from './components/NotFound';

import { DEMO_RAW_MATERIALS, DEMO_MEDICINES, DEMO_EVENTS } from './demoData';

import "./main_dashboard/assets/css/material-dashboard-react.css?v=1.9.0";

class App extends Component {
  constructor() {
    super();
    this.state = {
      account: null,
      supplyChain: null,
      loading: true,
      web3: null,
      isDemoMode: false,
    };
  }

  // FIXED: Changed from deprecated componentWillMount to componentDidMount
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockChain();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
        this.enableDemoMode();
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // FIXED: Graceful fallback for non-Ethereum browsers
      console.warn('Non-Ethereum browser detected. Entering Read-Only Demo Mode.');
      this.enableDemoMode();
    }
  }

  enableDemoMode = () => {
    // Determine which demo account to use based on the path (since SignIn routes to /owner, /supplier, etc)
    const currentPath = window.location.pathname;
    let demoAccount = "0x1234567890123456789012345678901234567890"; // Admin
    if (currentPath.includes('supplier')) demoAccount = "0x2234567890123456789012345678901234567890";
    if (currentPath.includes('transporter')) demoAccount = "0x3234567890123456789012345678901234567890";
    if (currentPath.includes('manufacturer')) demoAccount = "0x4234567890123456789012345678901234567890";
    if (currentPath.includes('wholesaler')) demoAccount = "0x5234567890123456789012345678901234567890";
    if (currentPath.includes('distributor')) demoAccount = "0x6234567890123456789012345678901234567890";

    const mockContractInstance = {
      methods: new Proxy({}, {
        get: (target, prop) => () => ({
          call: () => {
            if (prop === 'getMedicineInfo') {
              return Promise.resolve([
                "0x7770000000000000000000000000000000000000",
                "Paracetamol 500mg (Demo)",
                "1000",
                "3",
                ["0x3234567890123456789012345678901234567890"],
                "0x4234567890123456789012345678901234567890",
                "0x5234567890123456789012345678901234567890",
                "0x8880000000000000000000000000000000000000",
                "0x5234567890123456789012345678901234567890"
              ]);
            }
            if (prop === 'getRawMaterialInfo') {
              return Promise.resolve([
                "0x7770000000000000000000000000000000000000",
                "Active Pharma Ingredient (Demo)",
                "500",
                "1",
                "0x2234567890123456789012345678901234567890",
                "0x4234567890123456789012345678901234567890"
              ]);
            }
            if (prop === 'getAllTransactions') {
              return Promise.resolve([
                ["0xPREVTXNHASH123", "0x3234567890123456789012345678901234567890", "0x4234567890123456789012345678901234567890", "10", "10"]
              ]);
            }
            if (prop === 'getWDMeta' || prop === 'getDCMeta') {
              return Promise.resolve(["0xTXHASH123", "100", "0x6234567890123456789012345678901234567890"]);
            }
            return Promise.resolve(["Demo Value", "100", "0x1234567890123456789012345678901234567890"]);
          },
          send: () => ({
            once: (e, cb) => {
              if (e === 'receipt') cb({ status: true, transactionHash: "0xDEMO_TRANSACTION_HASH_999" });
              return { once: (e, cb) => { if (e === 'receipt') cb({ status: true }); } };
            }
          })
        })
      }),
      getPastEvents: () => Promise.resolve([
        {
          returnValues: {
            0: "0x7770000000000000000000000000000000000000",
            1: "1",
            2: "2",
            3: "0xDEMOSIGNATURE1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
            packageAddr: "0x7770000000000000000000000000000000000000",
            sellerNum: "1",
            buyerNum: "2"
          },
          event: "sendEvent",
          transactionHash: "0xDEMO_EVENT_TX_HASH"
        }
      ])
    };

    const dummySupplyChain = {
      events: new Proxy({}, {
        get: (target, prop) => () => ({ on: (event, cb) => {
          if (event === 'data' && DEMO_EVENTS[prop]) {
            DEMO_EVENTS[prop].forEach(e => cb(e));
          }
        } })
      }),
      methods: new Proxy({}, {
        get: (target, prop) => () => ({
          send: () => ({
            once: (e, cb) => {
              if (e === 'receipt') cb({ status: true, transactionHash: "0xDEMO_SUPPLY_CHAIN_TX" });
              return { once: (e, cb) => { if (e === 'receipt') cb({ status: true }); } };
            }
          }),
          call: () => {
            if (prop === 'verify') return Promise.resolve(true);
            if (prop === 'getAllPackages' || prop === 'getAllRawMaterials') return Promise.resolve(DEMO_RAW_MATERIALS);
            if (prop === 'getAllCreatedMedicines' || prop === 'getAllMedicinesAtWholesaler' || prop === 'getAllMedicinesAtDistributor') return Promise.resolve(DEMO_MEDICINES);
            if (prop === 'getUserInfo') return Promise.resolve({
              name: "Pharma Demo User",
              role: "Admin",
              userLoc: ["Silicon Valley", "USA"],
              0: "Demo Data",
              1: "Demo Data"
            });
            if (prop === 'getSubContractWD' || prop === 'getSubContractDC') return Promise.resolve("0x7770000000000000000000000000000000000000");
            return Promise.resolve([]);
          }
        })
      }),
      getPastEvents: (eventName, options) => {
        const targetAddress = (options && options.filter && options.filter.packageAddr) || "0x7770000000000000000000000000000000000000";
        const defaultEvent = {
          returnValues: {
            0: targetAddress,
            1: "0x2234567890123456789012345678901234567890",
            2: "0x4234567890123456789012345678901234567890",
            3: "0xDEMOSIGNATURE1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
            4: "1694780000",
            packageAddr: targetAddress,
            seller: "0x2234567890123456789012345678901234567890",
            buyer: "0x4234567890123456789012345678901234567890",
            signature: "0xDEMOSIGNATURE1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
          },
          event: eventName || "sendEvent",
          transactionHash: "0xDEMO_EVENT_TX_HASH"
        };
        return Promise.resolve([defaultEvent]);
      }
    };

    const dummyWeb3 = {
      utils: new Proxy({}, {
        get: (target, prop) => {
          if (prop === 'hexToUtf8' || prop === 'toAscii') return (str) => String(str || "");
          if (prop === 'fromAscii' || prop === 'padRight') return (str) => String(str || "");
          return () => "0x0000000000000000000000000000000000000000";
        }
      }),
      eth: {
        getAccounts: () => Promise.resolve([demoAccount]),
        Contract: function(abi, address) {
          return mockContractInstance;
        },
        accounts: {
          hashMessage: () => "0xHASHEDMESSAGE123456789"
        }
      }
    };

    window.web3 = dummyWeb3;

    this.setState({
      loading: false,
      isDemoMode: true,
      account: demoAccount,
      supplyChain: dummySupplyChain,
      web3: dummyWeb3
    });
  }

  async loadBlockChain() {
    if (this.state.isDemoMode) return; // Skip if in demo mode

    const web3 = window.web3;
    try {
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      
      const networkId = await web3.eth.net.getId();
      const networkData = SupplyChain.networks[networkId];
      
      if (networkData) {
        const supplyChain = new web3.eth.Contract(SupplyChain.abi, networkData.address);
        this.setState({
          supplyChain: supplyChain,
          loading: false,
          web3: web3
        });
      } else {
        console.error('Supply chain contract not deployed to detected network.');
        this.enableDemoMode(); // Fallback to demo mode if network is wrong
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
      this.enableDemoMode();
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/signup" component={SignUp} />
          <Route path="/verify" component={Verify} />
          
          {/* We will wire SignIn logic to actually route based on selected roles */}
          <Route path="/signin" render={(props) => (<SignIn {...props} isDemoMode={this.state.isDemoMode} />)} />

          <Route path="/owner" render={(props) => (<Owner account={this.state.account} supplyChain={this.state.supplyChain} web3={this.state.web3} />)} />
          <Route path="/supplier" render={(props) => (<Supplier account={this.state.account} supplyChain={this.state.supplyChain} web3={this.state.web3} />)} />
          <Route path="/transporter" render={(props) => (<Transporter account={this.state.account} supplyChain={this.state.supplyChain} web3={this.state.web3} />)} />
          <Route path="/manufacturer" render={(props) => (<Manufacturer account={this.state.account} supplyChain={this.state.supplyChain} web3={this.state.web3} />)} />
          <Route path="/wholesaler" render={(props) => (<Wholesaler account={this.state.account} supplyChain={this.state.supplyChain} web3={this.state.web3} />)} />
          <Route path="/distributor" render={(props) => (<Distributor account={this.state.account} supplyChain={this.state.supplyChain} web3={this.state.web3} />)} />

          <Route path="" component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;