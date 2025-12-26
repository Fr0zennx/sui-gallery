// Contract information - Update after deployment
export const PACKAGE_ID = "0x66c24ac29f8aab92d889cd696b8a69c4a83e3cf5c338d9c032242ac9e9380d97";
export const MODULE_NAME = "car_nft";

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
export const MIN_SPEED = 1;
export const MAX_SPEED = 100;
