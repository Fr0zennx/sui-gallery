module car_market::nft_shop {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use std::string::{Self, String};

    // --- Error Codes ---
    const ERR_INVALID_IMAGE_ID: u64 = 1;
    const ERR_SPEED_TOO_LOW: u64 = 2;
    const ERR_SPEED_TOO_HIGH: u64 = 3;
    const ERR_INSUFFICIENT_FUNDS: u64 = 4;

    // --- Struct Definitions ---

    /// Represents a Car NFT asset
    struct CarNFT has key, store {
        id: UID,
        name: String,
        speed: u64,
        image_url: String,
    }

    /// Represents a listing for sale in the marketplace
    struct Listing has key {
        id: UID,
        nft: CarNFT,
        price: u64,
        owner: address,
    }

    // --- Events ---
    struct NFTMinted has copy, drop {
        nft_id: ID,
        owner: address,
        name: String,
    }

    struct NFTListed has copy, drop {
        listing_id: ID,
        nft_id: ID,
        price: u64,
        seller: address,
    }

    struct NFTPurchased has copy, drop {
        listing_id: ID,
        nft_id: ID,
        price: u64,
        seller: address,
        buyer: address,
    }

    // --- Image URL Verification ---
    
    /// Returns a verified IPFS URL based on the image ID
    /// Valid image IDs: 1, 2, 3
    fun get_verified_url(image_id: u64): String {
        if (image_id == 1) {
            string::utf8(b"https://ipfs.io/ipfs/car_red")
        } else if (image_id == 2) {
            string::utf8(b"https://ipfs.io/ipfs/car_blue")
        } else if (image_id == 3) {
            string::utf8(b"https://ipfs.io/ipfs/car_black")
        } else {
            abort ERR_INVALID_IMAGE_ID
        }
    }

    // --- Public Functions ---

    /// Mints a new Car NFT with validated speed and image ID
    /// Speed must be between 1 and 100
    public fun mint_car_nft(
        name_bytes: vector<u8>,
        speed: u64,
        image_id: u64,
        ctx: &mut TxContext,
    ) {
        // Validate speed is within range
        assert!(speed >= 1, ERR_SPEED_TOO_LOW);
        assert!(speed <= 100, ERR_SPEED_TOO_HIGH);

        let name = string::utf8(name_bytes);
        let image_url = get_verified_url(image_id);

        let nft = CarNFT {
            id: object::new(ctx),
            name: name,
            speed,
            image_url,
        };

        let nft_id = object::id(&nft);
        let sender = tx_context::sender(ctx);

        // Emit minting event
        event::emit(NFTMinted {
            nft_id,
            owner: sender,
            name,
        });

        // Transfer NFT to the sender
        transfer::public_transfer(nft, sender);
    }

    /// Lists a Car NFT for sale in the marketplace
    /// The NFT is wrapped in a Listing object and shared
    public fun list_for_sale(
        nft: CarNFT,
        price: u64,
        ctx: &mut TxContext,
    ) {
        let nft_id = object::id(&nft);
        let sender = tx_context::sender(ctx);

        let listing = Listing {
            id: object::new(ctx),
            nft,
            price,
            owner: sender,
        };

        let listing_id = object::id(&listing);

        // Emit listing event
        event::emit(NFTListed {
            listing_id,
            nft_id,
            price,
            seller: sender,
        });

        // Share the listing object
        transfer::share_object(listing);
    }

    /// Purchases a Car NFT from a listing
    /// The buyer must provide sufficient SUI coins to match the listing price
    public fun purchase(
        listing: Listing,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        let listing_id = object::id(&listing);
        let Listing { id, nft, price, owner: seller } = listing;
        
        // Verify payment is sufficient
        assert!(coin::value(&payment) >= price, ERR_INSUFFICIENT_FUNDS);

        let buyer = tx_context::sender(ctx);
        let nft_id = object::id(&nft);

        // Emit purchase event
        event::emit(NFTPurchased {
            listing_id,
            nft_id,
            price,
            seller,
            buyer,
        });

        // Transfer payment to seller
        transfer::public_transfer(payment, seller);

        // Transfer NFT to buyer
        transfer::public_transfer(nft, buyer);

        // Delete the listing object
        object::delete(id);
    }
}
