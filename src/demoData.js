export const DEMO_USERS = {
  "0x1234567890123456789012345678901234567890": {
    name: "PharmaCorp Admin",
    role: "0", // Admin
    userLoc: ["New York", "USA"]
  },
  "0x2234567890123456789012345678901234567890": {
    name: "Global Chemicals Ltd.",
    role: "1", // Supplier
    userLoc: ["Berlin", "Germany"]
  },
  "0x3234567890123456789012345678901234567890": {
    name: "FastTrack Logistics",
    role: "2", // Transporter
    userLoc: ["London", "UK"]
  },
  "0x4234567890123456789012345678901234567890": {
    name: "MediLife Labs",
    role: "3", // Manufacturer
    userLoc: ["Geneva", "Switzerland"]
  },
  "0x5234567890123456789012345678901234567890": {
    name: "EuroPharma Wholesale",
    role: "4", // Wholesaler
    userLoc: ["Paris", "France"]
  },
  "0x6234567890123456789012345678901234567890": {
    name: "City Health Distributors",
    role: "5", // Distributor
    userLoc: ["Madrid", "Spain"]
  }
};

export const DEMO_RAW_MATERIALS = [
  "0xAAA0000000000000000000000000000000000001",
  "0xAAA0000000000000000000000000000000000002",
  "0xAAA0000000000000000000000000000000000003"
];

export const DEMO_MEDICINES = [
  "0xBBB0000000000000000000000000000000000001",
  "0xBBB0000000000000000000000000000000000002"
];

// Helper: resolve a medicine/raw-material address to a human-readable name
export const DEMO_MEDICINE_NAMES = {
  "0xBBB0000000000000000000000000000000000001": "Paracetamol 500mg Tablets (Batch #MED-2026-X9)",
  "0xBBB0000000000000000000000000000000000002": "Amoxicillin 250mg Capsules (Batch #AMX-9942)",
  "0xBBB0000000000000000000000000000000000003": "Insulin Glargine 100 IU/ml (Batch #INS-5501)",
};

export const DEMO_RAW_MATERIAL_NAMES = {
  "0xAAA0000000000000000000000000000000000001": "Active Pharma Ingredient — Paracetamol (500 kg)",
  "0xAAA0000000000000000000000000000000000002": "Amoxicillin Trihydrate — Raw Bulk (200 kg)",
  "0xAAA0000000000000000000000000000000000003": "Recombinant Human Insulin — Lyophilized (50 kg)",
};

// Resolve any address to a short readable label for display
export function resolveAddress(addr) {
  if (!addr) return "Unknown";
  const str = String(addr);
  return (
    DEMO_MEDICINE_NAMES[str] ||
    DEMO_RAW_MATERIAL_NAMES[str] ||
    DEMO_USERS[str]?.name ||
    str.slice(0, 8) + "..." + str.slice(-4)
  );
}

export const DEMO_EVENTS = {
  'UserRegister': [
    { returnValues: { _address: "0x2234...", name: "Global Chemicals Ltd." } },
    { returnValues: { _address: "0x4234...", name: "MediLife Labs" } }
  ],
  'buyEvent': [
    { returnValues: { buyer: "0x4234...", seller: "0x2234...", packageAddr: "0xAAA0000000000000000000000000000000000001", signature: "0xabc...", now: 1694775000 } }
  ],
  'respondEvent': [
    { returnValues: { buyer: "0x4234...", seller: "0x2234...", packageAddr: "0xAAA0000000000000000000000000000000000001", signature: "0xdef...", now: 1694776000 } }
  ],
  'sendEvent': [
    { returnValues: { seller: "0x2234...", buyer: "0x4234...", packageAddr: "0xAAA0000000000000000000000000000000000001", signature: "0x123...", now: 1694780000 } }
  ]
};

export const DEMO_TX_HASHES = [
  "0x9b8f887b4b1234567890abcdef1234567890abcdef1234567890abcdef123456",
  "0x8a7e776a3c0987654321fedcba0987654321fedcba0987654321fedcba098765"
];
