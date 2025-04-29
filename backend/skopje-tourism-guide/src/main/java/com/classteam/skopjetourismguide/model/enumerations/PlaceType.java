package com.classteam.skopjetourismguide.model.enumerations;

/**
 * Enum representing types of places in the tourism guide application.
 * Each enum value is mapped to a corresponding Google Maps API place type.
 * See https://developers.google.com/maps/documentation/places/web-service/supported_types
 */
public enum PlaceType {
    // Cultural and Historical Places
    HISTORICAL,                  // maps to "tourist_attraction" with keyword="historical"
    MUSEUMS,                     // maps to "museum"
    LANDMARKS,                   // maps to "tourist_attraction"
    ARCHAEOLOGICAL_SITE,         // maps to "tourist_attraction" with keyword="archaeological"
    MONUMENT,                    // maps to "tourist_attraction" with keyword="monument"
    CULTURAL_CENTER,             // maps to "point_of_interest" with keyword="cultural"

    // Entertainment
    THEATER,                     // maps to "theater"
    ART_GALLERY,                 // maps to "art_gallery"
    CINEMA,                      // maps to "movie_theater"
    NIGHTCLUB,                   // maps to "night_club"
    CASINO,                      // maps to "casino"
    GAME_CENTER,                 // maps to "amusement_park"

    // Natural Places
    NATURE,                      // maps to "natural_feature"
    PARKS,                       // maps to "park"
    VIEWPOINT,                   // maps to "tourist_attraction" with keyword="viewpoint"
    HIKING_TRAIL,                // maps to "park" with keyword="hiking"
    GARDEN,                      // maps to "park" with keyword="garden"
    FOREST,                      // maps to "natural_feature" with keyword="forest"
    MOUNTAIN,                    // maps to "natural_feature" with keyword="mountain"
    WATERFALL,                   // maps to "natural_feature" with keyword="waterfall"

    // Food and Drink
    RESTAURANT,                  // maps to "restaurant"
    CAFE_BAR,                    // maps to "cafe"
    BAKERY,                      // maps to "bakery"
    ICE_CREAM,                   // maps to "store" with keyword="ice cream"
    DESSERT_SHOP,                // maps to "store" with keyword="dessert"
    FOOD_COURT,                  // maps to "restaurant" with keyword="food court"
    BREWERY,                     // maps to "bar" with keyword="brewery"
    WINERY,                      // maps to "liquor_store" with keyword="winery"
    FOOD_TRUCK,                  // maps to "meal_takeaway" with keyword="food truck"
    BAR,                         // maps to "bar"
    SUPERMARKET,                 // maps to "supermarket"

    // Shopping
    MALL,                        // maps to "shopping_mall"
    STORE,                       // maps to "store"
    BOOK_STORE,                  // maps to "book_store"
    CLOTHING_STORE,              // maps to "clothing_store"
    ELECTRONICS_STORE,           // maps to "electronics_store"
    JEWELRY_STORE,               // maps to "jewelry_store"

    // Accommodation
    HOTEL,                       // maps to "lodging" with keyword="hotel"
    HOSTEL,                      // maps to "lodging" with keyword="hostel"
    RESORT,                      // maps to "lodging" with keyword="resort"
    APARTMENT,                   // maps to "lodging" with keyword="apartment"
    CAMPGROUND,                  // maps to "campground"

    // Sports and Recreation
    GYM,                         // maps to "gym"
    STADIUM,                     // maps to "stadium"
    SWIMMING_POOL,               // maps to "spa" with keyword="swimming pool"
    TENNIS_COURT,                // maps to "stadium" with keyword="tennis"
    SPA,                         // maps to "spa"
    BOWLING_ALLEY,               // maps to "bowling_alley"

    // Transportation
    PARKING,                     // maps to "parking"
    AIRPORT,                     // maps to "airport"
    TRAIN_STATION,               // maps to "train_station"
    BUS_STATION,                 // maps to "bus_station"
    SUBWAY_STATION,              // maps to "subway_station"
    TAXI_STAND,                  // maps to "taxi_stand"
    CAR_RENTAL,                  // maps to "car_rental"

    // Educational Institutions
    SCHOOL,                      // maps to "school"
    UNIVERSITY,                  // maps to "university"
    LIBRARY,                     // maps to "library"
    RESEARCH_INSTITUTE,          // maps to "university" with keyword="research"

    // Religious Places
    CHURCH,                      // maps to "church"
    MOSQUE,                      // maps to "mosque"
    TEMPLE,                      // maps to "hindu_temple"
    SYNAGOGUE,                   // maps to "synagogue"
    PLACE_OF_WORSHIP,            // maps to "place_of_worship"

    // Government and Services
    GOVERNMENT_BUILDING,         // maps to "city_hall"
    EMBASSY,                     // maps to "embassy"
    POLICE,                      // maps to "police"
    POST_OFFICE,                 // maps to "post_office"
    BANK,                        // maps to "bank"

    HOSPITAL,                    // maps to "hospital"
    PHARMACY,                    // maps to "pharmacy"

    // New categories from Google Places API
    AQUARIUM,                    // maps to "aquarium"
    BEAUTY_SALON,                // maps to "beauty_salon"
    CEMETERY,                    // maps to "cemetery"
    COURTHOUSE,                  // maps to "courthouse"
    PET_STORE,                   // maps to "pet_store"
    TOURIST_INFORMATION,         // maps to "tourist_attraction" with keyword="information"

    // Fallback
    UNKNOWN                      // maps to "point_of_interest"
}