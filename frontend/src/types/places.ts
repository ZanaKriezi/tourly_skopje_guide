import { BaseEntity } from './common';

export interface Place extends BaseEntity {
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  priceLevel?: number;
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