import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import LocalPharmacyIcon from "@material-ui/icons/LocalPharmacy";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import SecurityIcon from "@material-ui/icons/Security";
import AccessTime from "@material-ui/icons/AccessTime";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import TrendingUp from "@material-ui/icons/TrendingUp";
// core components
import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  return (
    <div>
      {/* Key Metrics Row */}
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <LocalPharmacyIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Verified Drug Batches</p>
              <h3 className={classes.cardTitle}>27</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <CheckCircleIcon style={{ color: '#4ade80', fontSize: 16 }} />
                All batches blockchain-verified
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <LocalShippingIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Active Shipments</p>
              <h3 className={classes.cardTitle}>8</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <AccessTime />
                IoT Cold-Chain: 4.1 °C Avg.
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <VerifiedUserIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Signatures Verified</p>
              <h3 className={classes.cardTitle}>142</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <TrendingUp style={{ color: '#fbbf24', fontSize: 16 }} />
                ECDSA on-chain verifications
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <SecurityIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Counterfeit Flags</p>
              <h3 className={classes.cardTitle}>0</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <CheckCircleIcon style={{ color: '#4ade80', fontSize: 16 }} />
                Supply chain is clean
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* Supply Chain Nodes & Recent Activity */}
      <GridContainer>
        {/* Supply Chain Nodes Status */}
        <GridItem xs={12} sm={12} md={5}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Supply Chain Node Status</h4>
              <p className={classes.cardCategoryWhite}>Live health of all 5 blockchain entities</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Role", "Entity", "Status", "Last Tx"]}
                tableData={[
                  ["Supplier", "Global Chemicals Ltd.", <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ Online</span>, "12:30"],
                  ["Transporter", "FastTrack Logistics", <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ Active</span>, "12:22"],
                  ["Manufacturer", "MediLife Labs", <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ Online</span>, "11:58"],
                  ["Wholesaler", "EuroPharma Wholesale", <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ Online</span>, "11:45"],
                  ["Distributor", "City Health Distr.", <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ Online</span>, "11:30"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>

        {/* Recent Medicine Batches */}
        <GridItem xs={12} sm={12} md={7}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Recent Medicine Batches On-Chain</h4>
              <p className={classes.cardCategoryWhite}>Last 3 verified pharmaceutical packages</p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["Batch #", "Medicine", "Quantity", "IoT Temp", "Status"]}
                tableData={[
                  [
                    "#MED-X9",
                    "Paracetamol 500mg",
                    "10,000 boxes",
                    <span style={{ color: '#38bdf8' }}>4.2 °C ✓</span>,
                    <span style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Verified</span>
                  ],
                  [
                    "#AMX-9942",
                    "Amoxicillin 250mg",
                    "5,000 packs",
                    <span style={{ color: '#38bdf8' }}>3.9 °C ✓</span>,
                    <span style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Verified</span>
                  ],
                  [
                    "#INS-5501",
                    "Insulin Glargine 100IU",
                    "2,500 vials",
                    <span style={{ color: '#38bdf8' }}>2.5 °C ✓</span>,
                    <span style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Verified</span>
                  ],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      {/* Network Stats */}
      <GridContainer>
        <GridItem xs={12}>
          <Card style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px', padding: '16px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Network</div>
                  <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>Ethereum Sepolia</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Contract Status</div>
                  <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '1.1rem' }}>✓ Demo Mode Active</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Smart Contracts</div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}>SupplyChain + Medicine + Txn</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Auth Method</div>
                  <div style={{ color: '#a855f7', fontWeight: 700, fontSize: '1.1rem' }}>ECDSA Signatures</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Cold-Chain Monitoring</div>
                  <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.1rem' }}>ThingSpeak IoT API</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
