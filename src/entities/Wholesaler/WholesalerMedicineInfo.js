import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader";
import Medicine from "../../build/Medicine.json";
import Transactions from "../../build/Transactions.json";
import { Link } from "react-router-dom";
import CustomStepper from "../../main_dashboard/components/Stepper/Stepper";
import { QRCodeSVG } from "qrcode.react";
import { FetchAPI } from "../temperature";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  card: {
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "24px",
    color: "#f8fafc",
    marginBottom: "24px"
  }
}));

export default function WholesalerMedicineInfo(props) {
  const classes = useStyles();
  const query = (props.location && props.location.query) ? props.location.query : {};
  const [account] = useState(query.account || props.account || "0x5234567890123456789012345678901234567890");
  const [medicineAddress] = useState(query.address || (props.match && props.match.params && props.match.params.id) || "0x7770000000000000000000000000000000000000");
  const [web3] = useState(query.web3 || props.web3 || window.web3);
  const [supplyChain] = useState(query.supplyChain || props.supplyChain || (window.web3 ? window.web3.dummySupplyChain : null));
  const [distributor, setDistributor] = useState("");
  const [medicineData, setMedicineData] = useState(null);
  const [subcontractAddress, setSubcontractAddress] = useState("");
  const [activeStep, setActiveStep] = useState(2);
  const [loading, isLoading] = useState(true);

  async function getMedicineData() {
    try {
      let medicine = new web3.eth.Contract(Medicine.abi, medicineAddress);
      let data = await medicine.methods.getMedicineInfo().call({ from: account });
      let subAddr = await supplyChain.methods
        .getSubContractWD(medicineAddress)
        .call({ from: account });
      let status = Number(data[6] || 2);
      let step = status;

      if (status === 2) {
        step = 3;
      } else if (status === 3) {
        step = 2;
      }
      data[1] = web3.utils.hexToUtf8(data[1]);
      setDistributor(data[5] || "0x6234567890123456789012345678901234567890");
      setMedicineData(data);
      setSubcontractAddress(subAddr);
      setActiveStep(step);
    } catch (err) {
      console.warn("Could not load blockchain medicine info:", err);
    } finally {
      isLoading(false);
    }
  }

  function getSupplyChainSteps() {
    return [
      "At Manufacturer",
      "Collected by Transporter",
      "Delivered to Wholesaler",
      "Collected by Transporter",
      "Delivered to Distributor",
      "Collected by Transporter",
      "Medicine Delivered",
    ];
  }

  function getSupplyChainStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return "Medicine at manufacturing stage in the supply chain.";
      case 1:
        return "Medicine collected by the Transporter is on its way to you.";
      case 2:
        return "Wholesaler, the medicine is currently with you!";
      case 3:
        return "Medicine is collected by the Transporter! On its way to the Distributor.";
      case 4:
        return "Medicine is delivered to the Distributor";
      case 5:
        return "Medicine collected by Transporter is on its way to the pharmacy/customer.";
      case 6:
        return "Medicine Delivered Successfully!";
      default:
        return "Unknown stepIndex";
    }
  }

  function sendPackage() {
    let medicine = new web3.eth.Contract(Medicine.abi, medicineAddress);
    // Use a pre-stored ECDSA signature (in real mode, this comes from the on-chain event)
    const signature = '0xDEMOSIGNATURE1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
    supplyChain.methods
      .sendPackageToEntity(distributor, account, medicineAddress, signature)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        let data = await medicine.methods
          .getMedicineInfo()
          .call({ from: account });
        let txnContractAddress = data[7] || "0x8880000000000000000000000000000000000000";
        let transporterAddress = (data[4] && data[4].length) ? data[4][data[4].length - 1] : "0x3234567890123456789012345678901234567890";
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
            alert("Package sent to Distributor successfully!");
          });
      });
  }

  useEffect(() => {
    getMedicineData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.card}>
      <h2 style={{ color: "#38bdf8", marginTop: 0 }}>Medicine Supply Chain Details</h2>
      <FetchAPI />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "24px", alignItems: "start" }}>
        <div>
          <p><b>Product Address:</b> <span style={{ fontFamily: "monospace", color: "#a855f7" }}>{medicineAddress}</span></p>
          <p><b>Manufacturer Address:</b> <span style={{ fontFamily: "monospace", color: "#60a5fa" }}>{medicineData ? medicineData[0] : "N/A"}</span></p>
          <p><b>Description:</b> {medicineData ? medicineData[1] : "N/A"}</p>
          <p><b>Raw Material Package:</b> {medicineData ? medicineData[2] : "N/A"}</p>
          <p><b>Quantity:</b> {medicineData ? medicineData[3] : "N/A"} units</p>
          <p><b>Transporter:</b> {medicineData ? (Array.isArray(medicineData[4]) ? medicineData[4].join(", ") : medicineData[4]) : "N/A"}</p>
          <p><b>Wholesaler:</b> {medicineData ? medicineData[8] : "N/A"}</p>
          <p><b>Distributor:</b> {distributor}</p>
          <p><b>Transaction Contract:</b> <span style={{ fontFamily: "monospace", color: "#34d399" }}>{medicineData ? medicineData[7] : "N/A"}</span></p>
          <p><b>Subcontract WD Address:</b> <span style={{ fontFamily: "monospace", color: "#fbbf24" }}>{subcontractAddress}</span></p>
        </div>

        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "12px" }}>
          <QRCodeSVG value={`${window.location.origin}/wholesaler/view-medicine/${medicineAddress}`} size={150} level="H" includeMargin={true} />
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "8px" }}>Scan to Audit Blockchain Track</p>
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
              pathname: `/wholesaler/view-request/${medicineAddress}`,
              query: {
                address: medicineAddress,
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
