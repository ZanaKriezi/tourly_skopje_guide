// src/pages/ToursPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTours } from "../context/ToursContext";
import {
  PreferenceDTO,
  TourCreateDTO,

} from "../types/tours";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import TourCard from "../components/tours/TourCard";
import PreferenceForm from "../components/tours/PreferenceForm";

enum TourCreationStep {
  NONE,
  PREFERENCES,
  NAMING,
}

const ToursPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    tours,
    loading,
    error,
    loadTours,
    createNewTour,
    clearError,
    setCreateTourPreference,
    createTourPreference,
  } = useTours();

  const [creationStep, setCreationStep] = useState<TourCreationStep>(
    TourCreationStep.NONE
  );
  const [newTourTitle, setNewTourTitle] = useState<string>("");
  const [creationError, setCreationError] = useState<string | null>(null);

  // Load tours on component mount
  useEffect(() => {
    const loadAllTours = async (): Promise<void> => {
      // If user is authenticated, load their tours
      if (isAuthenticated && user) {
        await loadTours({ userId: user.id });
      } else {
        // Load all tours for anonymous users
        await loadTours();
      }
    };

    loadAllTours();
  }, [loadTours, isAuthenticated, user]);

  // Handle starting the tour creation process
  const handleStartCreation = (): void => {
    if (!isAuthenticated) {
      setCreationError("You must be logged in to create a tour.");
      return;
    }

    setCreationStep(TourCreationStep.PREFERENCES);
    setCreationError(null);
  };

  // Handle saving preferences
  const handlePreferencesSave = (preference: PreferenceDTO): void => {
    setCreateTourPreference(preference);
    setCreationStep(TourCreationStep.NAMING);
  };

  // Handle canceling creation
  const handleCancelCreation = (): void => {
    setCreationStep(TourCreationStep.NONE);
    setNewTourTitle("");
    setCreationError(null);
  };

  // Handle creating the tour
  const handleCreateTour = async (): Promise<void> => {
    if (!newTourTitle.trim()) {
      setCreationError("Please enter a title for your tour.");
      return;
    }

    if (!createTourPreference) {
      setCreationError("Please set your tour preferences first.");
      return;
    }

    if (!user) {
      setCreationError("You must be logged in to create a tour.");
      return;
    }

    try {
      const tourData: TourCreateDTO = {
        title: newTourTitle,
        userId: user.id,
        preferenceDTO: createTourPreference,
      };

      await createNewTour(tourData);

      // Reset creation state
      setCreationStep(TourCreationStep.NONE);
      setNewTourTitle("");
      setCreationError(null);

      // Reload tours to include the new one
      await loadTours({ userId: user.id });
    } catch (err) {
      console.log(err);
      setCreationError("Failed to create tour. Please try again.");
    }
  };

  // Render the current step of tour creation
  const renderCreationStep = (): React.ReactNode => {
    switch (creationStep) {
      case TourCreationStep.PREFERENCES:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Set Your Tour Preferences
            </h2>
            <PreferenceForm
              initialPreference={createTourPreference || undefined}
              onSave={handlePreferencesSave}
              onCancel={handleCancelCreation}
            />
          </div>
        );

      case TourCreationStep.NAMING:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Name Your Tour</h2>
            <div className="mb-4">
              <label htmlFor="tourTitle" className="block font-medium mb-1">
                Tour Title
              </label>
              <input
                type="text"
                id="tourTitle"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTourTitle}
                onChange={(e) => setNewTourTitle(e.target.value)}
                placeholder="My Skopje Adventure"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setCreationStep(TourCreationStep.PREFERENCES)}
              >
                Back
              </Button>
              <Button onClick={handleCreateTour}>Create Tour</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-2">Tours</h1>
      <p className="text-gray-600 mb-6">
        Discover curated tours of Skopje or create your own personalized
        experience
      </p>

      {/* Tour Creation Button */}
      {creationStep === TourCreationStep.NONE && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Create Your Own Tour
              </h2>
              <p className="text-gray-600">
                Customize a tour based on your preferences and interests
              </p>
            </div>
            <Button onClick={handleStartCreation}>Create Tour</Button>
          </div>

          {creationError && !isAuthenticated && (
            <div className="mt-4 text-red-600">
              {creationError}{" "}
              <a href="/login" className="underline">
                Log in
              </a>{" "}
              to continue.
            </div>
          )}

          {creationError && isAuthenticated && (
            <div className="mt-4 text-red-600">{creationError}</div>
          )}
        </div>
      )}

      {/* Tour Creation Form */}
      {renderCreationStep()}

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadTours();
          }}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="my-8">
          <LoadingSpinner size="lg" text="Loading tours..." />
        </div>
      )}

      {/* Tours List */}
      {!loading && tours.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">No tours found.</p>
          <p className="text-gray-600">
            {isAuthenticated
              ? "Create your first tour using the button above!"
              : "Log in to create and save your own tours."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default ToursPage;
