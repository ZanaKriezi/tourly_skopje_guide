import { Place, PlaceType } from '../types/places';

// Dummy place images
const placeImages = [
  'https://images.unsplash.com/photo-1573167947328-df013e82e7cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1629624476895-ba9a5c47c09a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1585211969224-3e992986159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
];

// Generate dummy places
export const dummyPlaces: Place[] = [
  {
    id: 1,
    name: "Kale Fortress",
    description: "Historic fortress offering panoramic views of the city. Located on the highest point in Skopje, this fortress dates back to the 6th century and provides a glimpse into the city's rich history.",
    placeType: PlaceType.HISTORICAL,
    address: "Samuilova, Skopje",
    imageUrl: placeImages[0],
    averageRating: 4.5,
    sentimentTag: "historic",
    duration: "1-2 hours",
    tags: ["Historic", "Viewpoint"],
    category: "Historic",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Museum of Macedonia",
    description: "Museum showcasing Macedonian history and culture with artifacts dating back thousands of years. The exhibits cover archaeological, historical, and ethnological aspects of Macedonia.",
    placeType: PlaceType.MUSEUMS,
    address: "Krste Misirkov bb, Skopje",
    imageUrl: placeImages[1],
    averageRating: 4.3,
    sentimentTag: "educational",
    duration: "1-3 hours",
    tags: ["Art", "Culture"],
    category: "Museum",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Matka Canyon",
    description: "A beautiful nature escape with caves and boat tours. Just 15km from the city center, Matka Canyon offers stunning landscapes, hiking trails, and boat trips to the Vrelo Cave.",
    placeType: PlaceType.NATURE,
    address: "Matka, Skopje",
    imageUrl: placeImages[2],
    averageRating: 4.7,
    sentimentTag: "scenic",
    duration: "Half day",
    tags: ["Nature", "Adventure"],
    category: "Nature",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "City Park",
    description: "Large urban park with walking paths and playgrounds. A perfect place for relaxation, picnics, and outdoor activities in the heart of Skopje.",
    placeType: PlaceType.PARKS,
    address: "Gradski Park, Skopje",
    imageUrl: placeImages[3],
    averageRating: 4.4,
    sentimentTag: "relaxing",
    duration: "1 hour",
    tags: ["Relax", "Greenery"],
    category: "Park",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Stone Bridge",
    description: "Iconic bridge with cultural significance. This Ottoman bridge connects Skopje's main square to the Old Bazaar and has been a symbol of the city for centuries.",
    placeType: PlaceType.LANDMARKS,
    address: "Macedonia Square, Skopje",
    imageUrl: placeImages[4],
    averageRating: 4.6,
    sentimentTag: "iconic",
    duration: "15–30 minutes",
    tags: ["Landmark", "Historic"],
    category: "Landmark",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Skopski Merak",
    description: "Well-known traditional Macedonian restaurant offering authentic local cuisine in a cozy atmosphere with live folk music in the evenings.",
    placeType: PlaceType.RESTAURANT,
    address: "Debar Maalo, Skopje",
    imageUrl: placeImages[0],
    averageRating: 4.6,
    sentimentTag: "authentic",
    duration: "1-2 hours",
    tags: ["Food", "Traditional"],
    category: "Restaurant",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "Skopje City Mall",
    description: "Modern shopping mall with a cinema and food court. The largest mall in Skopje featuring international and local brands, restaurants, and entertainment options.",
    placeType: PlaceType.MALL,
    address: "Ljubljanska 4, Skopje",
    imageUrl: placeImages[1],
    averageRating: 4.3,
    sentimentTag: "modern",
    duration: "2-3 hours",
    tags: ["Shopping", "Entertainment"],
    category: "Mall",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Broz Cafe",
    description: "Trendy café-bar popular with locals and tourists, known for its great coffee, cocktails, and relaxed atmosphere with outdoor seating.",
    placeType: PlaceType.CAFE_BAR,
    address: "Debar Maalo, Skopje",
    imageUrl: placeImages[2],
    averageRating: 4.5,
    sentimentTag: "trendy",
    duration: "1-2 hours",
    tags: ["Coffee", "Chill"],
    category: "Cafe/Bar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9,
    name: "Public Room",
    description: "Creative community space and chill café-bar offering a unique environment for working, socializing, and attending cultural events.",
    placeType: PlaceType.CAFE_BAR,
    address: "50 Divizija, Skopje",
    imageUrl: placeImages[3],
    averageRating: 4.4,
    sentimentTag: "artsy",
    duration: "1 hour",
    tags: ["Creative", "Social"],
    category: "Cafe/Bar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "Pelister",
    description: "Elegant restaurant on the main square serving traditional and international cuisine with a great view of Skopje's landmarks.",
    placeType: PlaceType.RESTAURANT,
    address: "Macedonia Square, Skopje",
    imageUrl: placeImages[4],
    averageRating: 4.6,
    sentimentTag: "central",
    duration: "2-3 hours",
    tags: ["Fine Dining", "Central"],
    category: "Restaurant",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];


// Create a mock API service that uses the dummy data
export const mockApiService = {
  // Place-related endpoints
  places: {
    getAll: async (category?: string): Promise<Place[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (category) {
        return dummyPlaces.filter(place => place.placeType === category);
      }
      return dummyPlaces;
    },
    
    getById: async (id: number): Promise<Place> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const place = dummyPlaces.find(p => p.id === id);
      if (!place) {
        throw new Error(`Place with ID ${id} not found`);
      }
      return place;
    },
    
    search: async (query: string): Promise<Place[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const lowercaseQuery = query.toLowerCase();
      return dummyPlaces.filter(place => 
        place.name.toLowerCase().includes(lowercaseQuery) || 
        place.description.toLowerCase().includes(lowercaseQuery)
      );
    }
  },
  
  // System-related endpoints
  system: {
    testConnection: async (): Promise<string> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return "Backend connection successful!";
    }
  }
};