module car_market::car_nft {
    use std::string::String;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};

    // ========= ERRORS =========
    const ERR_INVALID_IMAGE_ID: u64 = 1;
    const ERR_SPEED_TOO_HIGH: u64 = 2;
    const ERR_INCORRECT_AMOUNT: u64 = 3;

    // ========= STRUCTS =========

    public struct Car has key, store {
        // TODO 1: Add fields for Car (id, name, image_url, speed)
    }

    public struct CarMetadata has key {
        // TODO 2: Add fields for Metadata (id, car_id, minted_at)
    }

    public struct ListCar has key {
        // TODO 3: Add fields for Marketplace Listing (id, car, price, seller)
    }

    // ========= EVENTS =========

    public struct CarListed has copy, drop {
        // TODO 4: Add fields for the Listing Event
    }

    public struct CarBought has copy, drop {
        // TODO 5: Add fields for the Purchase Event
    }

    // ========= INTERNAL FUNCTIONS =========

    fun get_verified_url(image_id: u64): String {
        if (image_id == 1) {
            std::string::utf8(b"https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmX_RedSpeedster")
        } else if (image_id == 2) {
            std::string::utf8(b"https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmY_MidnightDrifter")
        } else if (image_id == 3) {
            std::string::utf8(b"https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmZ_DesertNomad")
        } else {
            abort ERR_INVALID_IMAGE_ID
        }
    }

    // ========= PUBLIC FUNCTIONS =========

    public fun mint_car(
        // TODO 6: Define function parameters
    ) {
        // TODO 6.1: Add speed assertion
        
        let image_url = get_verified_url(image_id);
        let car_uid = sui::object::new(ctx);
        let car_id = sui::object::uid_to_inner(&car_uid);

        let car = Car {
            // TODO 6.2: Initialize Car fields
        };

        let metadata = CarMetadata {
            // TODO 6.3: Initialize Metadata with timestamp
        };

        // TODO 6.4: Freeze metadata and transfer car to sender
    }

    public fun list_car(car: Car, price: u64, ctx: &mut sui::tx_context::TxContext) {
        // TODO 7: Setup listing and share the object
        let list_car = ListCar {
            // Initialize fields here
        };

        event::emit(CarListed {
            // Emit listing details
        });
        
        // Share listing object
    }

    public fun buy_car(list_car: ListCar, payment: Coin<SUI>, ctx: &mut sui::tx_context::TxContext) {
        // TODO 8: Complete the purchase logic
        // Deconstruct listing, verify payment, and transfer assets
    }
}