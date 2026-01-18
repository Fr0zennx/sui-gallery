// Contract information - Update after deployment
export const PACKAGE_ID = "<PAKET_IDINIZ>"; // Gerçek package ID'yi buraya girin
export const MODULE_NAME = "car_nft";
export const CONTRACT_ADDRESS = "car_market"; // Package name veya address alias

// Sui Clock object
export const SUI_CLOCK_OBJECT_ID = "0x6" as const;

// Network Configuration
export const NETWORK = "testnet"; // or "mainnet"

// Car images and models
export const CAR_MODELS = [
  {
    id: 1,
    name: "Red Speedster",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
    description: "Perfect choice for speed enthusiasts",
    defaultSpeed: 85,
  },
  {
    id: 2,
    name: "Midnight Drifter",
    imageUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop",
    description: "King of night races",
    defaultSpeed: 90,
  },
  {
    id: 3,
    name: "Desert Nomad",
    imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
    description: "Conqueror of desert tracks",
    defaultSpeed: 80,
  },
] as const;

// Speed limits
export const MIN_SPEED = 0;
export const MAX_SPEED = 300;

// Fonksiyon isimleri
export const FUNC_MINT_CAR = "mint_car";
export const FUNC_LIST_CAR = "list_car";
export const FUNC_BUY_CAR = "buy_car";

// Image ID ve araba isimleri eşlemesi
export const CAR_IMAGES = [
  {
    id: 1,
    name: "RedSpeedster",
    url: "https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmX_RedSpeedster"
  },
  {
    id: 2,
    name: "MidnightDrifter",
    url: "https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmY_MidnightDrifter"
  },
  {
    id: 3,
    name: "DesertNomad",
    url: "https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmZ_DesertNomad"
  }
];

export const IMAGE_ID_TO_NAME: Record<number, string> = {
  1: "RedSpeedster",
  2: "MidnightDrifter",
  3: "DesertNomad"
};
