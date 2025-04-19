//package com.classteam.skopjetourismguide.bootstrap;
//
//import com.classteam.skopjetourismguide.model.Place;
//import com.classteam.skopjetourismguide.model.enumerations.PlaceType;
//import com.classteam.skopjetourismguide.repository.PlaceRepository;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Component;
//import java.util.List;
//
//@Component
//public class DataHolder {
//    private final PlaceRepository placeRepository;
//
//    public DataHolder(PlaceRepository placeRepository) {
//        this.placeRepository = placeRepository;
//    }
//
//    @PostConstruct
//    public void init() {
//        if (placeRepository.count() == 0) {
//            List<Place> places = List.of(
//                    createPlace("Kale Fortress", "Samuilova, Skopje", "Historic fortress offering views of the city.", PlaceType.HISTORICAL, 4.5f, "historic", "kale_fortress_id"),
//                    createPlace("Museum of Macedonia", "Krste Misirkov bb, Skopje", "Museum showcasing Macedonian history and culture.", PlaceType.MUSEUMS, 4.3f, "educational", "museum_macedonia_id"),
//                    createPlace("Matka Canyon", "Matka, Skopje", "A beautiful nature escape with caves and boat tours.", PlaceType.NATURE, 4.7f, "scenic", "matka_canyon_id"),
//                    createPlace("City Park", "Gradski Park, Skopje", "Large urban park with walking paths and playgrounds.", PlaceType.PARKS, 4.4f, "relaxing", "city_park_id"),
//                    createPlace("Skopje Fortress Clock Tower", "Samuilova, Skopje", "Iconic clock tower with cultural significance.", PlaceType.LANDMARKS, 4.2f, "iconic", "clock_tower_id"),
//                    createPlace("Skopski Merak", "Debar Maalo, Skopje", "Well-known traditional Macedonian restaurant.", PlaceType.RESTAURANT, 4.6f, "authentic", "skopski_merak_id"),
//                    createPlace("Skopje City Mall", "Ljubljanska 4, Skopje", "Modern shopping mall with a cinema and food court.", PlaceType.MALL, 4.3f, "modern", "city_mall_id"),
//                    createPlace("Broz Cafe", "Debar Maalo, Skopje", "Trendy café-bar popular with locals and tourists.", PlaceType.CAFE_BAR, 4.5f, "trendy", "broz_cafe_id"),
//                    createPlace("Public Room", "50 Divizija, Skopje", "Creative community space and chill café-bar.", PlaceType.CAFE_BAR, 4.4f, "artsy", "public_room_id"),
//                    createPlace("Pelister", "Macedonia Square, Skopje", "Elegant restaurant on the main square.", PlaceType.RESTAURANT, 4.6f, "central", "pelister_id")
//            );
//            placeRepository.saveAll(places);
//        }
//    }
//
//    private Place createPlace(String name, String address, String description, PlaceType placeType, Float averageRating, String sentimentTag, String googlePlaceId) {
//        Place place = new Place();
//        place.setName(name);
//        place.setAddress(address);
//        place.setDescription(description);
//        place.setPlaceType(placeType);
//        place.setAverageRating(averageRating);
//        place.setSentimentTag(sentimentTag);
//        place.setGooglePlaceId(googlePlaceId); // Set the required googlePlaceId field
//        return place;
//    }
//}