// src/components/tours/PreferenceForm.tsx
import React, { useState } from 'react';
import { 
  PreferenceDTO, 
  TourLength, 
  BudgetLevel, 
  FoodType, 
  DrinkType, 
  AttractionType 
} from '../../types/tours';
import Button from '../common/Button';

interface PreferenceFormProps {
  initialPreference?: PreferenceDTO;
  onSave: (preference: PreferenceDTO) => void;
  onCancel?: () => void;
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({
  initialPreference,
  onSave,
  onCancel
}) => {
  // Default preference values
  const defaultPreference: PreferenceDTO = {
    tourLength: TourLength.HALF_DAY,
    budgetLevel: BudgetLevel.MODERATE,
    includeShoppingMalls: false,
    foodTypePreferences: [],
    drinkTypePreferences: [],
    attractionTypePreferences: []
  };

  const [preference, setPreference] = useState<PreferenceDTO>(
    initialPreference || defaultPreference
  );
  
  // Handle checkbox change for attraction types
  const handleAttractionChange = (attraction: AttractionType): void => {
    setPreference(prev => {
      const attractions = [...prev.attractionTypePreferences];
      const index = attractions.indexOf(attraction);
      
      if (index === -1) {
        attractions.push(attraction);
      } else {
        attractions.splice(index, 1);
      }
      
      return {
        ...prev,
        attractionTypePreferences: attractions
      };
    });
  };
  
  // Handle checkbox change for food types
  const handleFoodChange = (food: FoodType): void => {
    setPreference(prev => {
      const foods = [...prev.foodTypePreferences];
      const index = foods.indexOf(food);
      
      if (index === -1) {
        foods.push(food);
      } else {
        foods.splice(index, 1);
      }
      
      return {
        ...prev,
        foodTypePreferences: foods
      };
    });
  };
  
  // Handle checkbox change for drink types
  const handleDrinkChange = (drink: DrinkType): void => {
    setPreference(prev => {
      const drinks = [...prev.drinkTypePreferences];
      const index = drinks.indexOf(drink);
      
      if (index === -1) {
        drinks.push(drink);
      } else {
        drinks.splice(index, 1);
      }
      
      return {
        ...prev,
        drinkTypePreferences: drinks
      };
    });
  };
  
  // Handle shopping malls toggle
  const handleShoppingMallsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPreference(prev => ({
      ...prev,
      includeShoppingMalls: e.target.checked
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setPreference(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setPreference(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSave(preference);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Tour Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={preference.description || ''}
          onChange={handleInputChange}
          placeholder="Describe your ideal tour"
        />
      </div>
      
      {/* Tour Length */}
      <div>
        <label htmlFor="tourLength" className="block font-medium mb-1">
          Tour Length
        </label>
        <select
          id="tourLength"
          name="tourLength"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={preference.tourLength}
          onChange={handleSelectChange}
        >
          <option value={TourLength.HALF_DAY}>Half Day</option>
          <option value={TourLength.FULL_DAY}>Full Day</option>
          <option value={TourLength.TWO_THREE_DAYS}>2-3 Days</option>
          <option value={TourLength.FOUR_SEVEN_DAYS}>4-7 Days</option>
        </select>
      </div>
      
      {/* Budget Level */}
      <div>
        <label htmlFor="budgetLevel" className="block font-medium mb-1">
          Budget Level
        </label>
        <select
          id="budgetLevel"
          name="budgetLevel"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={preference.budgetLevel}
          onChange={handleSelectChange}
        >
          <option value={BudgetLevel.ON_BUDGET}>On Budget</option>
          <option value={BudgetLevel.MODERATE}>Moderate</option>
          <option value={BudgetLevel.LUXURY}>Luxury</option>
        </select>
      </div>
      
      {/* Attraction Types */}
      <div>
        <p className="font-medium mb-2">Attraction Types</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(AttractionType).map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preference.attractionTypePreferences.includes(type)}
                onChange={() => handleAttractionChange(type)}
                className="rounded text-primary focus:ring-primary"
              />
              <span>{type.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Food Types */}
      <div>
        <p className="font-medium mb-2">Food Preferences</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(FoodType).map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preference.foodTypePreferences.includes(type)}
                onChange={() => handleFoodChange(type)}
                className="rounded text-primary focus:ring-primary"
              />
              <span>{type.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Drink Types */}
      <div>
        <p className="font-medium mb-2">Drink Preferences</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(DrinkType).map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preference.drinkTypePreferences.includes(type)}
                onChange={() => handleDrinkChange(type)}
                className="rounded text-primary focus:ring-primary"
              />
              <span>{type.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Shopping Malls */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preference.includeShoppingMalls}
            onChange={handleShoppingMallsChange}
            className="rounded text-primary focus:ring-primary"
          />
          <span>Include Shopping Malls</span>
        </label>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit">
          Save Preferences
        </Button>
      </div>
    </form>
  );
};

export default PreferenceForm;