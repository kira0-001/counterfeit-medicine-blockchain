import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader";
import RawMaterial from "../../build/RawMaterial.json";
import CustomStepper from "../../main_dashboard/components/Stepper/Stepper";

import { QRCodeSVG } from "qrcode.react";

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

export default function ReceivedRawMaterial(props) {
  const classes = useStyles();
  const query = (props.location && props.location.query) ? props.location.query : {};
  const [account] = useState(query.account || props.account || "0x4234567890123456789012345678901234567890");
  const [rawMaterialAddress] = useState(query.address || (props.match && props.match.params && props.match.params.id) || "0xAAA0000000000000000000000000000000000001");
  const [web3] = useState(query.web3 || props.web3 || window.web3);
  const [rawMaterialData, setRawMaterialData] = useState(null);
  const [activeStep, setActiveStep] = useState(2);
  const [loading, isLoading] = useState(true);


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

  async function saveRawMaterialDetails() {
    isLoading(true);
    alert("Raw Material Info synchronized to Database.");
    isLoading(false);
  }

  useEffect(() => {
    async function getRawMaterialData() {
      if (!web3 || !rawMaterialAddress) return;
      try {
        const rawMaterial = new web3.eth.Contract(
          RawMaterial.abi,
          rawMaterialAddress
        );
        let data = await rawMaterial.methods
          .getSuppliedRawMaterials()
          .call({ from: account });
        let status = await rawMaterial.methods.getRawMaterialStatus().call();
        let step = Number(status || 2);

        data[1] = web3.utils.hexToUtf8(data[1]);
        setRawMaterialData(data);
        setActiveStep(step);
      } catch (err) {
        console.warn("Could not load received raw material:", err);
      } finally {
        isLoading(false);
      }
    }
    
    getRawMaterialData();
  }, [account, rawMaterialAddress, web3]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={classes.card}>
      <h2 style={{ color: "#38bdf8", marginTop: 0 }}>Received Raw Material Inspection</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "24px", alignItems: "start" }}>
        <div>
          <p><b>Generated Product ID:</b> <span style={{ fontFamily: "monospace", color: "#a855f7" }}>{rawMaterialAddress}</span></p>
          <p><b>Description:</b> {rawMaterialData ? rawMaterialData[1] : "N/A"}</p>
          <p><b>Quantity:</b> {rawMaterialData ? rawMaterialData[2] : "N/A"} units</p>
          <p><b>Supplier:</b> <span style={{ fontFamily: "monospace", color: "#60a5fa" }}>{rawMaterialData ? rawMaterialData[3] : "N/A"}</span></p>
          <p><b>Transporter:</b> {rawMaterialData ? rawMaterialData[4] : "N/A"}</p>
          <p><b>Manufacturer:</b> <span style={{ fontFamily: "monospace", color: "#34d399" }}>{rawMaterialData ? rawMaterialData[5] : account}</span></p>
          <p><b>Transaction Contract:</b> <span style={{ fontFamily: "monospace", color: "#fbbf24" }}>{rawMaterialData ? rawMaterialData[6] : "N/A"}</span></p>
        </div>

        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", padding: "16px", borderRadius: "12px" }}>
          <QRCodeSVG value={rawMaterialAddress} size={150} level="H" includeMargin={true} />
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "8px" }}>Scan to Audit Verification</p>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <CustomStepper
          getSteps={getSupplyChainSteps}
          activeStep={activeStep}
          getStepContent={getSupplyChainStepContent}
        />
      </div>

      <div style={{ marginTop: "24px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveRawMaterialDetails}
        >
          Sync to Database
        </Button>
      </div>
    </div>
  );
}
