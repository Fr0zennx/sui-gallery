module car_market::car_nft {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // ========= ERRORS =========
    const ERR_INVALID_IMAGE_ID: u64 = 1;
    const ERR_SPEED_TOO_HIGH: u64 = 2;
    const ERR_INCORRECT_AMOUNT: u64 = 3;

    // ========= STRUCTS =========

    public struct Car has key, store {
        id: UID,
        name: String,
        image_url: String,
        speed: u64,
    }

    public struct CarMetadata has key {
        id: UID,
        car_id: ID,
        minted_at: u64,
    }

    public struct ListCar has key {
        id: UID,
        car: Car,
        price: u64,
        seller: address,
    }

    // ========= EVENTS =========

    public struct CarListed has copy, drop {
        car_id: ID,
        price: u64,
        seller: address,
    }

    public struct CarBought has copy, drop {
        car_id: ID,
        price: u64,
        buyer: address,
    }

    // ========= INTERNAL FUNCTIONS =========

    fun get_verified_url(image_id: u64): String {
        if (image_id == 1) {
            string::utf8(b"https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmX_RedSpeedster")
        } else if (image_id == 2) {
            string::utf8(b"https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmY_MidnightDrifter")
        } else if (image_id == 3) {
            string::utf8(b"https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmZ_DesertNomad")
        } else {
            abort ERR_INVALID_IMAGE_ID
        }
    }

    // ========= PUBLIC FUNCTIONS =========

    public entry fun mint_car(
        name: vector<u8>,
        speed: u64,
        image_id: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(speed <= 300, ERR_SPEED_TOO_HIGH);
        
        let image_url = get_verified_url(image_id);
        let car_uid = object::new(ctx);
        let car_id = object::uid_to_inner(&car_uid);

        let car = Car {
            id: car_uid,
            name: string::utf8(name),
            image_url,
            speed,
        };

        let metadata = CarMetadata {
            id: object::new(ctx),
            car_id,
            minted_at: clock::timestamp_ms(clock),
        };

        // Freeze metadata (making it immutable) and transfer car to sender
        transfer::freeze_object(metadata);
        transfer::public_transfer(car, tx_context::sender(ctx));
    }

    public entry fun list_car(car: Car, price: u64, ctx: &mut TxContext) {
        let car_id = object::id(&car);
        let seller = tx_context::sender(ctx);

        let listing = ListCar {
            id: object::new(ctx),
            car,
            price,
            seller,
        };

        event::emit(CarListed {
            car_id,
            price,
            seller,
        });
        
        // Share the listing object so anyone can view and buy it
        transfer::share_object(listing);
    }

    public entry fun buy_car(listing: ListCar, payment: Coin<SUI>, ctx: &mut TxContext) {
        let ListCar { id, car, price, seller } = listing;
        
        // 1. Verify payment amount
        assert!(coin::value(&payment) == price, ERR_INCORRECT_AMOUNT);

        let buyer = tx_context::sender(ctx);
        let car_id = object::id(&car);

        // 2. Pay the seller
        transfer::public_transfer(payment, seller);

        // 3. Deliver the car to the buyer
        transfer::public_transfer(car, buyer);

        // 4. Clean up the listing UID
        object::delete(id);

        event::emit(CarBought {
            car_id,
            price,
            buyer,
        });
    }
}