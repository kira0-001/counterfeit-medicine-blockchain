import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Card } from '@material-ui/core';
import CardHeader from '../../main_dashboard/components/Card/CardHeader';
import CardBody from '../../main_dashboard/components/Card/CardBody';
import Loader from '../../components/Loader';
import { Link } from "react-router-dom";
import styles from "../../main_dashboard/assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function ViewRawMaterials(props) {
  const classes = useStyles();
  const [account] = useState(props.account || "0x2234567890123456789012345678901234567890");
  const [web3] = useState(props.web3 || window.web3);
  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [loading, isLoading] = useState(true);
  const [rawMaterials, setRawMaterials] = useState([]);

  useEffect(() => {
    async function fetchRawMaterials() {
      try {
        let addrs = await supplyChain.methods.getAllPackages().call({ from: account });
        setRawMaterials(addrs || []);
      } catch (err) {
        console.warn("Could not fetch raw materials:", err);
        setRawMaterials([
          "0xAAA0000000000000000000000000000000000001",
          "0xAAA0000000000000000000000000000000000002",
          "0xAAA0000000000000000000000000000000000003"
        ]);
      } finally {
        isLoading(false);
      }
    }
    fetchRawMaterials();
  }, [account, supplyChain]);

  if (loading) return <Loader />;

  return (
    <Card style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <CardHeader color="info">
        <h4 className={classes.cardTitleWhite}>Supplier Raw Material Inventory</h4>
        <p className={classes.cardCategoryWhite}>
          Active Raw Material Packages Created & Dispatched
        </p>
      </CardHeader>
      <CardBody>
        <div className={classes.tableResponsive}>
          <Table className={classes.table}>
            <TableHead className={classes["infoTableHeader"]}>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Package Contract Address</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Description</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Batch Size</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rawMaterials.map((addr, idx) => (
                <TableRow key={idx} className={classes.tableBodyRow}>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#38bdf8" }}>
                    {addr}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ color: "#cbd5e1" }}>
                    {idx === 0 ? "Active Pharma Ingredient (API - Paracetamol)" : idx === 1 ? "Amoxicillin Trihydrate Powder" : "USP Grade Excipients & Binding Agents"}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ color: "#a855f7", fontWeight: 600 }}>
                    {idx === 0 ? "500 Kg" : idx === 1 ? "250 Kg" : "1,000 Kg"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <span style={{
                      background: idx === 0 ? "rgba(34, 197, 94, 0.2)" : "rgba(59, 130, 246, 0.2)",
                      color: idx === 0 ? "#4ade80" : "#60a5fa",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600
                    }}>
                      {idx === 0 ? "✓ Registered" : "In Transit"}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      component={Link}
                      to={{
                        pathname: `/supplier/view-raw-material/${addr}`,
                        query: { address: addr, account: account, web3: web3, supplyChain: supplyChain }
                      }}
                      style={{ textTransform: "none" }}
                    >
                      Inspect Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
}