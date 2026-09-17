import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader";
import RawMaterial from "../../build/RawMaterial.json";
import Transactions from "../../build/Transactions.json";
import { Link } from "react-router-dom";
import CustomStepper from "../../main_dashboard/components/Stepper/Stepper";
import { FetchAPI } from "../temperature";

const useStyles = makeStyles((theme) => ({
  card: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "24px",
    color: "#f8fafc",
    marginBottom: "24px"
  }
}));

export default function RawMaterialInfo(props) {
  const classes = useStyles();
  const query = (props.location && props.location.query) ? props.location.query : {};
  const [account] = useState(query.account || props.account || "0x2234567890123456789012345678901234567890");
  const [rawMaterialAddress] = useState(query.address || (props.match && props.match.params && props.match.params.id) || "0xAAA0000000000000000000000000000000000001");
  const [web3] = useState(query.web3 || props.web3 || window.web3);
  const [supplyChain] = useState(query.supplyChain || props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [manufacturer, setManufacturer] = useState("");
  const [rawMaterialData, setRawMaterialData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, isLoading] = useState(true);

  async function getRawMaterialData() {
    try {
      let rawMaterial = new web3.eth.Contract(
        RawMaterial.abi,
        rawMaterialAddress
      );
      let data = await rawMaterial.methods
        .getSuppliedRawMaterials()
        .call({ from: account });
      let status = await rawMaterial.methods
        .getRawMaterialStatus()
        .call({ from: account });
      let step = Number(status || 0);

      if (status === 2) {
        step = 3;
      } else if (status === 3) {
        step = 2;
      }
      data[1] = web3.utils.hexToUtf8(data[1]);
      setManufacturer(data[5] || "0x4234567890123456789012345678901234567890");
      setRawMaterialData(data);
      setActiveStep(step);
    } catch (err) {
      console.warn("Could not load raw material data:", err);
    } finally {
      isLoading(false);
    }
  }

  function getSupplyChainSteps() {
    return [
      "At Supplier",
      "Collected by Transporter",
      "Delivered to Manufacturer",
    ];
  }

  function getSupplyChainStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return "Raw Material is at supplier stage in the supply chain.";
      case 1:
        return "Raw Material collected by the Transporter is on its way to the Manufacturer.";
      case 2:
        return "Raw Material currently with the Manufacturer";
      default:
        return "Unknown stepIndex";
    }
  }

  function sendPackage() {
    let rawMaterial = new web3.eth.Contract(
      RawMaterial.abi,
      rawMaterialAddress
    );
    // Use a pre-stored ECDSA demo signature (in real mode, from on-chain event)
    const signature = '0xDEMOSIGNATURE1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    supplyChain.methods
      .sendPackageToEntity(manufacturer, account, rawMaterialAddress, signature)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        let data = await rawMaterial.methods
          .getSuppliedRawMaterials()
          .call({ from: account });
        let txnContractAddress = data[6] || "0x8880000000000000000000000000000000000000";
        let transporterAddress = data[4] || "0x3234567890123456789012345678901234567890";
        let txnHash = receipt.transactionHash;
        const transactions = new web3.eth.Contract(
          Transactions.abi,
          txnContractAddress
        );
        let txns = await transactions.methods
          .getAllTransactions()
          .call({ from: account });
        let prevTxn = (txns && txns.length) ? txns[txns.length - 1][0] : "0xPREVTXNHASH";
        transactions.methods
          .createTxnEntry(
            txnHash,
            account,
            transporterAddress,
            prevTxn,
            "10",
            "10"
          )
          .send({ from: account })
          .once("receipt", () => {
            alert("Raw material package dispatched to Manufacturer successfully!");
          });
      });
  }

  useEffect(() => {
    getRawMaterialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.card}>
      <h2 style={{ color: "#38bdf8", marginTop: 0 }}>Raw Material Package Details</h2>
      <FetchAPI />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "24px", alignItems: "start" }}>
        <div>
          <p><b>Generated Product ID:</b> <span style={{ fontFamily: "monospace", color: "#a855f7" }}>{rawMaterialAddress}</span></p>
          <p><b>Description:</b> {rawMaterialData ? rawMaterialData[1] : "N/A"}</p>
          <p><b>Product Quantity:</b> {rawMaterialData ? rawMaterialData[2] : "N/A"} units</p>
          <p><b>Product Supplier:</b> <span style={{ fontFamily: "monospace", color: "#60a5fa" }}>{rawMaterialData ? rawMaterialData[3] : "N/A"}</span></p>
          <p><b>Product Transporter:</b> {rawMaterialData ? rawMaterialData[4] : "N/A"}</p>
          <p><b>Product Manufacturer:</b> <span style={{ fontFamily: "monospace", color: "#34d399" }}>{manufacturer}</span></p>
          <p><b>Transaction Contract:</b> <span style={{ fontFamily: "monospace", color: "#fbbf24" }}>{rawMaterialData ? rawMaterialData[6] : "N/A"}</span></p>
        </div>

        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "12px" }}>
          <QRCodeSVG value={rawMaterialAddress} size={150} level="H" includeMargin={true} />
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "8px" }}>Scan to Verify Supplier Origin</p>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <CustomStepper
          getSteps={getSupplyChainSteps}
          activeStep={activeStep}
          getStepContent={getSupplyChainStepContent}
        />
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <Button variant="contained" color="primary">
          <Link
            to={{
              pathname: `/supplier/view-request/${rawMaterialAddress}`,
              query: {
                address: rawMaterialAddress,
                account: account,
                web3: web3,
                supplyChain: supplyChain,
              },
            }}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            View Requests
          </Link>
        </Button>
        <Button variant="contained" color="secondary" onClick={sendPackage}>
          Send Package
        </Button>
      </div>
    </div>
  );
}
