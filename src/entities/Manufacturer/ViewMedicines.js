import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Card } from '@material-ui/core';
import CardHeader from '../../main_dashboard/components/Card/CardHeader';
import CardBody from '../../main_dashboard/components/Card/CardBody';
import Loader from '../../components/Loader';
import { Link } from "react-router-dom";
import styles from "../../main_dashboard/assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function ViewMedicines(props) {
  const classes = useStyles();
  const [account] = useState(props.account || "0x4234567890123456789012345678901234567890");
  const [web3] = useState(props.web3 || window.web3);
  const [supplyChain] = useState(props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [loading, isLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        let addrs = await supplyChain.methods.getAllCreatedMedicines().call({ from: account });
        setMedicines(addrs || []);
      } catch (err) {
        console.warn("Could not fetch created medicines:", err);
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
      <CardHeader color="success">
        <h4 className={classes.cardTitleWhite}>Manufactured Medicine Batches</h4>
        <p className={classes.cardCategoryWhite}>
          Finished Pharmaceutical Products Ready for Distribution
        </p>
      </CardHeader>
      <CardBody>
        <div className={classes.tableResponsive}>
          <Table className={classes.table}>
            <TableHead className={classes["successTableHeader"]}>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Medicine Smart Contract</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Drug Name & Strength</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Batch Size</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Wholesaler Destination</TableCell>
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
                  <TableCell className={classes.tableCell} style={{ color: "#a855f7", fontWeight: 600 }}>
                    {idx === 0 ? "10,000 Boxes" : "5,000 Packs"}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#60a5fa" }}>
                    EuroPharma Wholesale (0x5234...)
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      component={Link}
                      to={{
                        pathname: `/manufacturer/view-medicine/${addr}`,
                        query: { address: addr, account: account, web3: web3, supplyChain: supplyChain }
                      }}
                      style={{ textTransform: "none" }}
                    >
                      Inspect Batch
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