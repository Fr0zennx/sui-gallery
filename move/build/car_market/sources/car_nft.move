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
        id: sui::object::UID,
        name: String,
        image_url: String,
        speed: u64,
    }

    /// NFT'nin ne zaman basıldığını tutan dondurulmuş veri
    public struct CarMetadata has key {
        id: sui::object::UID,
        car_id: sui::object::ID,
        minted_at: u64,
    }

    /// Pazaryerinde listelenen arabalar
    public struct ListCar has key {
        id: sui::object::UID,
        car: Car,
        price: u64,
        seller: address,
    }

    // ========= EVENTS =========

    public struct CarListed has copy, drop {
        listing_id: sui::object::ID,
        car_id: sui::object::ID,
        price: u64,
        seller: address,
    }

    public struct CarBought has copy, drop {
        listing_id: sui::object::ID,
        car_id: sui::object::ID,
        buyer: address,
        price: u64,
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

    /// Araba NFT'si basar. Clock nesnesi zaman damgası için gereklidir.
    public fun mint_car(
        name: String, 
        speed: u64, 
        image_id: u64, 
        clock: &Clock, 
        ctx: &mut sui::tx_context::TxContext
    ) {
        // Hız kontrolü
        assert!(speed <= 100, ERR_SPEED_TOO_HIGH);
        
        let image_url = get_verified_url(image_id);
        let car_uid = sui::object::new(ctx);
        let car_id = sui::object::uid_to_inner(&car_uid);

        let car = Car {
            id: car_uid,
            name,
            image_url,
            speed
        };

        let metadata = CarMetadata {
            id: sui::object::new(ctx),
            car_id,
            minted_at: clock::timestamp_ms(clock),
        };

        // Metadata'yı donduruyoruz (değiştirilemez hale gelir)
        sui::transfer::freeze_object(metadata);
        // Arabayı sahibine yolla
        sui::transfer::public_transfer(car, sui::tx_context::sender(ctx));
    }

    /// Arabayı pazaryerine koyar
    public fun list_car(car: Car, price: u64, ctx: &mut sui::tx_context::TxContext) {
        let listing_uid = sui::object::new(ctx);
        let listing_id = sui::object::uid_to_inner(&listing_uid);
        let car_id = sui::object::id(&car);
        let seller = sui::tx_context::sender(ctx);

        let list_car = ListCar {
            id: listing_uid,
            car,
            price,
            seller,
        };

        event::emit(CarListed {
            listing_id,
            car_id,
            price,
            seller,
        });

        sui::transfer::share_object(list_car);
    }

    /// Pazaryerinden araba satın alır
    public fun buy_car(list_car: ListCar, payment: Coin<SUI>, ctx: &mut sui::tx_context::TxContext) {
        let ListCar { id, car, price, seller } = list_car;
        
        // Ödeme kontrolü
        assert!(coin::value(&payment) == price, ERR_INCORRECT_AMOUNT);

        let buyer = sui::tx_context::sender(ctx);
        let car_id = sui::object::id(&car);

        // Parayı satıcıya, arabayı alıcıya yolla
        sui::transfer::public_transfer(payment, seller);
        sui::transfer::public_transfer(car, buyer);

        event::emit(CarBought {
            listing_id: sui::object::uid_to_inner(&id),
            car_id,
            buyer,
            price,
        });

        // İlan objesini yok et
        sui::object::delete(id);
    }
}
