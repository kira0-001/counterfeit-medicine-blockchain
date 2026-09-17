/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.82)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

// Simulated real-time blockchain event feed
const DEMO_EVENTS_FEED = [
  {
    id: 1,
    type: "Medicine Delivered",
    icon: CheckCircleOutlineIcon,
    color: "#4ade80",
    bgColor: "rgba(74, 222, 128, 0.1)",
    actor: "City Health Distributors",
    package: "Paracetamol 500mg (Batch #MED-2026-X9)",
    txHash: "0x9b8f...3456",
    timestamp: "2026-09-15 12:30:01",
    detail: "Package delivered to pharmacy and verified on-chain."
  },
  {
    id: 2,
    type: "Signature Verified",
    icon: VerifiedUserIcon,
    color: "#38bdf8",
    bgColor: "rgba(56, 189, 248, 0.1)",
    actor: "EuroPharma Wholesale",
    package: "Amoxicillin 250mg Capsules (Batch #AMX-9942)",
    txHash: "0x8a7e...8765",
    timestamp: "2026-09-15 11:58:45",
    detail: "Manufacturer ECDSA signature verified by wholesaler."
  },
  {
    id: 3,
    type: "Package Shipped",
    icon: LocalShippingIcon,
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.1)",
    actor: "FastTrack Logistics",
    package: "Insulin Glargine 100 IU/ml (Batch #INS-5501)",
    txHash: "0x7f6e...ba09",
    timestamp: "2026-09-15 10:22:17",
    detail: "Cold-chain shipment initiated. IoT temp: 2.5 °C ✓"
  },
  {
    id: 4,
    type: "Batch Produced",
    icon: AccountBalanceIcon,
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.1)",
    actor: "MediLife Labs (Geneva)",
    package: "Paracetamol 500mg — 10,000 units",
    txHash: "0x6e5d...0987",
    timestamp: "2026-09-15 09:05:33",
    detail: "Medicine batch minted as on-chain NFT-like asset."
  },
  {
    id: 5,
    type: "Raw Material Registered",
    icon: SwapHorizIcon,
    color: "#f472b6",
    bgColor: "rgba(244, 114, 182, 0.1)",
    actor: "Global Chemicals Ltd. (Berlin)",
    package: "Active Pharma Ingredient — 500 kg",
    txHash: "0x5d4c...8765",
    timestamp: "2026-09-15 08:00:00",
    detail: "Raw material package NFT created and assigned to Manufacturer."
  }
];

export default function BlockchainEventsFeed() {
  const classes = useStyles();
  const [events, setEvents] = useState(DEMO_EVENTS_FEED);
  const [latestPulse, setLatestPulse] = useState(true);

  useEffect(() => {
    // Simulate a new event arriving every 15 seconds
    const interval = setInterval(() => {
      setLatestPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="info" style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #1e1b4b 100%)",
            borderBottom: "1px solid rgba(56, 189, 248, 0.3)"
          }}>
            <h4 className={classes.cardTitleWhite} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "10px",
                height: "10px",
                background: "#4ade80",
                borderRadius: "50%",
                display: "inline-block",
                boxShadow: latestPulse ? "0 0 8px #4ade80" : "none",
                transition: "box-shadow 0.5s ease"
              }}></span>
              Live Blockchain Event Feed
            </h4>
            <p className={classes.cardCategoryWhite}>
              Real-time on-chain supply chain events — Last synced: {new Date().toLocaleTimeString()}
            </p>
          </CardHeader>
          <CardBody>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {events.map((event) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.id}
                    style={{
                      background: event.bgColor,
                      border: `1px solid ${event.color}40`,
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{
                      background: `${event.color}20`,
                      borderRadius: "10px",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Icon style={{ color: event.color, fontSize: 24 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", flexWrap: "wrap", gap: "8px" }}>
                        <span style={{
                          color: event.color,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          background: `${event.color}15`,
                          padding: "2px 10px",
                          borderRadius: "20px",
                          border: `1px solid ${event.color}30`
                        }}>
                          {event.type}
                        </span>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{event.timestamp}</span>
                      </div>
                      <p style={{ margin: "4px 0", color: "#f8fafc", fontWeight: 600, fontSize: "0.95rem" }}>
                        {event.package}
                      </p>
                      <p style={{ margin: "2px 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                        <span style={{ color: "#cbd5e1" }}>{event.actor}</span> — {event.detail}
                      </p>
                      <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#475569", fontSize: "0.75rem" }}>Tx Hash:</span>
                        <span style={{
                          fontFamily: "monospace",
                          color: "#60a5fa",
                          fontSize: "0.8rem",
                          background: "rgba(59, 130, 246, 0.08)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          border: "1px solid rgba(59, 130, 246, 0.2)"
                        }}>
                          {event.txHash}
                        </span>
                        <span style={{ color: "#4ade80", fontSize: "0.75rem" }}>✓ Confirmed</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: "24px",
              padding: "16px",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "2px" }}>Total On-Chain Events</div>
                  <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "1.4rem" }}>142</div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "2px" }}>Verified Batches</div>
                  <div style={{ color: "#4ade80", fontWeight: 700, fontSize: "1.4rem" }}>27</div>
                </div>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "2px" }}>Suspicious Flags</div>
                  <div style={{ color: "#f87171", fontWeight: 700, fontSize: "1.4rem" }}>0</div>
                </div>
              </div>
              <div style={{
                background: "rgba(74, 222, 128, 0.1)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                borderRadius: "10px",
                padding: "8px 16px",
                color: "#4ade80",
                fontWeight: 600,
                fontSize: "0.85rem"
              }}>
                ✓ All Supply Chain Nodes Healthy
              </div>
            </div>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
