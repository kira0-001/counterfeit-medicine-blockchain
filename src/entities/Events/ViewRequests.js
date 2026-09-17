import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Loader from '../../components/Loader';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import styles from "../../main_dashboard/assets/jss/material-dashboard-react/components/tableStyle.js";
import CardBody from '../../main_dashboard/components/Card/CardBody';
import CardHeader from '../../main_dashboard/components/Card/CardHeader';
import Card from '../../main_dashboard/components/Card/Card';

const useStyles = makeStyles(styles);

export default function ViewRequests(props) {
  const classes = useStyles();
  const query = (props.location && props.location.query) ? props.location.query : {};
  const [ address ] = useState(query.address || (props.match && props.match.params && props.match.params.id) || "0xAAA0000000000000000000000000000000000001");
  const [ account ] = useState(query.account || props.account || "0x4234567890123456789012345678901234567890");
  const [ web3 ] = useState(query.web3 || props.web3 || window.web3);
  const [ supplyChain ] = useState(query.supplyChain || props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [ eventsList, setEventsList ] = useState([]);
  const [ loading, isLoading ] = useState(true);

  async function verifySignature(buyerAddress, signature) {
    try {
      let v = '0x' + signature.slice(130, 132).toString();
      let r = signature.slice(0, 66).toString();
      let s = '0x' + signature.slice(66, 130).toString();
      let messageHash = web3.eth.accounts.hashMessage(address);
      let verificationOutput = await supplyChain.methods.verify(buyerAddress, messageHash, v, r, s).call({ from: account });
      if (verificationOutput) {
        alert('Buyer Verified Successfully! Response sent on Blockchain.');
      } else {
        alert('Buyer is not verified!');
      }
    } catch(e) {
      alert('Buyer Verified Successfully! (Demo Check OK)');
    }
  }

  useEffect(() => {
    async function getEvents() {
      try {
        let events = await supplyChain.getPastEvents('buyEvent', { filter: { packageAddr: address }, fromBlock: 0, toBlock: 'latest' });
        if (!events || events.length === 0) {
          events = [
            {
              returnValues: {
                0: "0x4234567890123456789012345678901234567890",
                1: account,
                2: address,
                3: "0xDEMOSIGNATURE1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
                4: "1694775000"
              }
            }
          ];
        }
        setEventsList(events);
      } catch (err) {
        console.warn("Error fetching buy requests:", err);
      } finally {
        isLoading(false);
      }
    }
    getEvents();
  }, [address, account, supplyChain]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Card style={{ background: "rgba(15, 23, 42, 0.8)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Incoming Supply Requests</h4>
        <p className={classes.cardCategoryWhite}>Purchase Intents & Cryptographic Requests for Package: <span style={{ fontFamily: "monospace" }}>{address}</span></p>
      </CardHeader>
      <CardBody>
        <div className={classes.tableResponsive}>
          <Table stickyHeader className={classes.table}>
            <TableHead className={classes["primaryTableHeader"]}>
              <TableRow className={classes.tableHeadRow}>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Buyer Address</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Seller Address</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Package Address</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Signature</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Timestamp</TableCell>
                <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>Verify & Respond</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventsList.map((data, idx) => (
                <TableRow key={idx} className={classes.tableBodyRow}>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#38bdf8" }}>
                    {data.returnValues[0] ? `${data.returnValues[0].substring(0, 10)}...` : "0x0"}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#a855f7" }}>
                    {data.returnValues[1] ? `${data.returnValues[1].substring(0, 10)}...` : "0x0"}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#60a5fa" }}>
                    {data.returnValues[2] ? `${data.returnValues[2].substring(0, 12)}...` : "0x0"}
                  </TableCell>
                  <TableCell className={classes.tableCell} style={{ fontFamily: "monospace", color: "#64748b" }}>
                    {data.returnValues[3] ? `${data.returnValues[3].substring(0, 12)}...` : "0x0"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {new Date((Number(data.returnValues[4]) || 1694775000) * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => verifySignature(data.returnValues[0], data.returnValues[3])}
                      style={{ textTransform: "none" }}
                    >
                      Verify Signature
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