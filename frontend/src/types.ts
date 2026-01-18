export interface CarNFT {
  id: string;
  name: string;
  image_url: string;
  speed: number;
}

export interface ListedCar extends CarNFT {
  listingId: string;
  carId: string;
  price: number;
  seller: string;
}

export interface CarMetadata {
  id: string;
  car_id: string;
  minted_at: number;
}

export interface CarModel {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  defaultSpeed: number;
}
