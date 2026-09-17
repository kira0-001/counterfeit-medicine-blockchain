# 🔗 Blockchain Pharma Anti-Counterfeit Supply Chain

> **Ethereum · Solidity · React.js · IoT Telemetry · QR Authentication**

An end-to-end blockchain platform that tracks pharmaceutical medicines from raw ingredient suppliers to pharmacy shelves — making counterfeit drugs impossible to inject into the supply chain.

---

## 💡 The Problem
The WHO estimates **1 in 10 medical products** in low-to-middle-income countries is substandard or falsified. Counterfeit medicines kill hundreds of thousands of people annually. Traditional supply chains rely on paper records and central databases — both easy to forge or hack.

## ✅ Our Solution
Every step in the supply chain is permanently written to an **Ethereum smart contract** — a tamper-proof public ledger that no single party controls. Any pharmacist can scan a QR code and instantly verify the drug's entire history, from the factory batch to the delivery truck temperature.

---

## 🎯 Who Uses This?

| Role | What They Do |
|------|-------------|
| 🔐 **Admin/Owner** | Adds verified users (suppliers, manufacturers, etc.) to the blockchain |
| 🏭 **Supplier** | Registers raw material batches with weight, origin, and composition |
| 🚚 **Transporter** | Picks up packages, logs live IoT GPS & temperature readings |
| ⚗️ **Manufacturer** | Converts raw materials into medicine batches, mints QR Code |
| 🏪 **Wholesaler** | Verifies manufacturer signature, stores in warehouse |
| 📦 **Distributor / Pharmacy** | Receives final product, scans QR to confirm authenticity |

---

## 🌟 Key Features

- **Immutable Blockchain Ledger** — Every handoff is recorded on Ethereum, forever
- **Live IoT Cold-Chain Simulator** — Real-time temperature chart in the Transporter dashboard; simulates hardware failures with visual alerts
- **QR Code Generator** — Auto-generated on medicine creation; links to a public `/verify` page
- **Interactive Supply Chain Simulator** — Watch a batch travel across 5 blockchain nodes with live status cards
- **Instant Authenticity Audit Tool** — Enter any batch ID or contract address to audit its full history
- **Modern Dark UI** — Premium glassmorphism design with role-specific background imagery

---

## 🛠 Tech Stack

```
Frontend:   React.js, Material-UI, Web3.js, QRCode.react
Blockchain: Ethereum, Solidity Smart Contracts
Dev Tools:  Truffle, Ganache (local blockchain)
Extras:     IoT Telemetry Simulation, QR Code Auth, SVG Charts
```

---

## 🚀 How to Run (Local Demo)

### Prerequisites
- Node.js v14+
- Ganache (local Ethereum blockchain)
- MetaMask browser extension

### Steps
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd counterfeit-medicine

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start Ganache on port 7545

# 4. Deploy smart contracts
cd blockchain
truffle migrate --reset

# 5. Start the React app
cd ..
npm start

# 6. Open http://localhost:3000
```

### Demo Mode (No Blockchain Required)
The app automatically runs in **Demo Mode** if no Ganache instance is detected. All features are fully interactive with simulated data. Just run `npm start` and explore!

---

## 📸 Project Flow

```
Raw Material      →    Transporter     →    Manufacturer     →   Wholesaler    →   Distributor
(Registered on        (IoT Temp Logged      (QR Code Minted      (Signature        (Authenticity
 Ethereum)             to Blockchain)        to Medicine)          Verified)         Confirmed)
```

---

## 📁 Project Structure

```
src/
├── components/        # Shared components (Landing, Verify, Header)
├── entities/          # Role dashboards
│   ├── Owner/         # Admin: Add Users
│   ├── Supplier/      # Register Raw Materials
│   ├── Transporter/   # Handle Packages + IoT Chart
│   ├── Manufacturer/  # Create Medicine + QR Code
│   ├── Wholesaler/    # Request & Transfer
│   └── Distributor/   # Receive & Verify
├── build/             # Compiled Solidity ABIs
└── demoData.js        # Demo mode fallback data
```

---

## 🔒 Smart Contract Architecture

| Contract | Purpose |
|----------|---------|
| `SupplyChain.sol` | Master registry — manages users, roles, and medicine routing |
| `RawMaterial.sol` | Represents a registered raw material batch |
| `Medicine.sol` | Represents a manufactured medicine batch with full provenance |
| `Transactions.sol` | Logs every transfer event with timestamp and participant addresses |

---

## 👨‍💻 Built By

**Developed by [@kira0-001](https://github.com/kira0-001)**

This project demonstrates the intersection of **Blockchain Security**, **IoT Integration**, and **Modern React Frontend Development** for solving a critical real-world healthcare problem.
---

> **📌 Note:** This is a demonstration/portfolio project. For production deployment, smart contracts should be audited and deployed to a public testnet (Sepolia) or mainnet.
