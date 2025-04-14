import { BaseEntity } from './common';

export enum PlaceType {
  HISTORICAL = 'HISTORICAL',
  MUSEUMS = 'MUSEUMS',
  NATURE = 'NATURE',
  PARKS = 'PARKS',
  LANDMARKS = 'LANDMARKS',
  RESTAURANT = 'RESTAURANT',
  CAFE_BAR = 'CAFE_BAR',
  MALL = 'MALL'
}

export interface Place extends BaseEntity {
  name: string;
  description: string;
  placeType: PlaceType;
  address: string;
  phoneNumber?: string;
  websiteURL?: string;
  socialMedia?: string;
  imageUrl?: string;
  averageRating: number;
  sentimentTag?: string;
}

export interface PlaceFilter {
  type?: PlaceType;
  query?: string;
  minRating?: number;
}

export interface UserProfile extends BaseEntity {
  username: string;
  email: string;
  name?: string;
  surname?: string;
  age?: number;
  gender?: string;
  preferences?: string[];
}