// src/types/tours.ts
import { PlaceDTO } from './places';

export enum TourLength {
  HALF_DAY = 'HALF_DAY',
  FULL_DAY = 'FULL_DAY',
  TWO_THREE_DAYS = 'TWO_THREE_DAYS',
  FOUR_SEVEN_DAYS = 'FOUR_SEVEN_DAYS'
}

export enum BudgetLevel {
  ON_BUDGET = 'ON_BUDGET',
  MODERATE = 'MODERATE',
  LUXURY = 'LUXURY'
}

export enum FoodType {
  ITALIAN = 'ITALIAN',
  ASIAN = 'ASIAN',
  BALKAN = 'BALKAN',
  FINE_DINING = 'FINE_DINING',
  FAST_FOOD = 'FAST_FOOD',
  MEDITERRANEAN = 'MEDITERRANEAN',
  VEGAN = 'VEGAN'
}

export enum DrinkType {
  COFFEE = 'COFFEE',
  COCKTAILS = 'COCKTAILS',
  TEA = 'TEA',
  BEER = 'BEER',
  WINE = 'WINE',
  SMOOTHIES = 'SMOOTHIES'
}

export enum AttractionType {
  HISTORICAL = 'HISTORICAL',
  MUSEUMS = 'MUSEUMS',
  NATURE = 'NATURE',
  PARKS = 'PARKS',
  LANDMARKS = 'LANDMARKS'
}

export interface PreferenceDTO {
  id?: number;
  description?: string;
  tourLength: TourLength;
  budgetLevel: BudgetLevel;
  includeShoppingMalls: boolean;
  foodTypePreferences: FoodType[];
  drinkTypePreferences: DrinkType[];
  attractionTypePreferences: AttractionType[];
}

export interface TourDTO {
  id: number;
  title: string;
  dateCreated: string;
  userId: number;
  userName: string;
  preferenceId: number;
  preferenceDescription?: string;
  places: PlaceDTO[];
}

export interface TourCreateDTO {
  title: string;
  userId?: number;
  preferenceId?: number;
  preferenceDTO?: PreferenceDTO;
  placeIds?: number[];
}

export interface TourFilter {
  title?: string;
  userId?: number;
  preferenceId?: number;
}