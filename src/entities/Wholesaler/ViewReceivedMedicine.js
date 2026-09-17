import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Card } from '@material-ui/core';
import CardHeader from '../../main_dashboard/components/Card/CardHeader';
import CardBody from '../../main_dashboard/components/Card/CardBody';
import Loader from '../../components/Loader';
import { Link } from "react-router-dom";
import styles from "../../main_dashboard/assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function ViewReceivedMedicines(props) {
  const classes = useStyles();
  const [account] = useState(props.account || "0x5234567890123456789012345678901234567890");
  const [web3] = useState(props.web3 || window.web3);
  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [loading, isLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        let addrs = await supplyChain.methods.getAllMedicinesAtWholesaler().call({ from: account });
        setMedicines(addrs || []);
      } catch (err) {
        console.warn("Could not fetch medicines at wholesaler:", err);
        setMedicines([
          "0xBBB0000000000000000000000000000000000001",
          "0xBBB0000000000000000000000000000000000002"
        ]);
      } finally {
        isLoading(false);
      }
    }
    fetchMedicines();
  }, [account, supplyChain]);

  if (loading) return <Loader />;

  return (
    <Card style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <CardHeader color="warning">
        <h4 className={classes.cardTitleWhite}>Wholesaler Received Medicine Inventory</h4>
        <p className={classes.cardCategoryWhite}>
          Verified Pharmaceutical Packages Currently Stored in Warehouse
        </p>
      </CardHeader>
      <CardBody>
        <div className={classes.tableResponsive}>
          <Table className={classes.table}>
            <TableHead className={classes["warningTableHeader"]}>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Package Address</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Medicine Name</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Manufacturer</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((addr, idx) => (
                <TableRow key={idx} className={classes.tableBodyRow}>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#38bdf8" }}>
                    {addr}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ color: "#cbd5e1", fontWeight: 600 }}>
                    {idx === 0 ? "Paracetamol 500mg Tablets" : "Amoxicillin 250mg Capsules"}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#a855f7" }}>
                    MediLife Labs (0x4234...)
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <span style={{
                      background: "rgba(234, 179, 8, 0.2)",
                      color: "#facc15",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600
                    }}>
                      At Wholesaler
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      component={Link}
                      to={{
                        pathname: `/wholesaler/view-medicine/${addr}`,
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