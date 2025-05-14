// src/pages/TourDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTours } from "../context/ToursContext";
import { usePlaces } from "../context/PlacesContext";
import { useAuth } from "../context/AuthContext";
import Container from "../components/layout/Container";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import PlaceCard from "../components/places/PlaceCard";
import MapView from "../components/places/MapView";

const TourDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedTour, loading, error, loadTourById, deleteTour, clearError } =
    useTours();
  const { loadPlaces } = usePlaces();
  const { user } = useAuth();

  const [selectedPlaceId, setSelectedPlaceId] = useState<number | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load tour details on component mount
  useEffect(() => {
    if (id) {
      loadTourById(Number(id)).catch((error) => {
        console.error("Error loading tour details:", error);
      });
    }
  }, [id, loadTourById]);

  // Load available places for adding to tour
  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  // Handle back button
  const handleBack = (): void => {
    navigate("/tours");
  };

  // Handle deleting the tour
  const handleDeleteTour = async (): Promise<void> => {
    if (!id) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteTour(Number(id));

      // Navigate back to tours list after deletion
      navigate("/tours");
    } catch (err) {
      console.error("Error deleting tour:", err);
      setDeleteError("Failed to delete tour. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if the current user owns this tour
  const isOwner = user && selectedTour && user.id === selectedTour.userId;

  // Format the date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.log("Error parsing date:", error);
      return "Unknown date";
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner size="lg" text="Loading tour details..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            if (id) loadTourById(Number(id));
          }}
        />
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          ← Back to Tours
        </Button>
      </Container>
    );
  }

  if (!selectedTour) {
    return (
      <Container>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
          <p className="text-gray-600 mb-6">
            The tour you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="outline" onClick={handleBack}>
            ← Back to Tours
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={handleBack} className="hover:text-primary">
          Tours
        </button>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{selectedTour.title}</span>
      </div>

      {/* Title and Info */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="text-3xl font-bold">{selectedTour.title}</h1>

          {isOwner && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/tours/${id}/edit`)}
              >
                Edit Tour
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleDeleteTour}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Tour"}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-2 text-gray-600">
          <p>
            Created by {selectedTour.userName} on{" "}
            {formatDate(selectedTour.dateCreated)}
          </p>
        </div>

        {selectedTour.preferenceDescription && (
          <div className="mt-2 text-gray-600">
            <p>{selectedTour.preferenceDescription}</p>
          </div>
        )}

        {deleteError && <div className="mt-4 text-red-600">{deleteError}</div>}
      </div>

      {/* Map View */}
      {selectedTour.places.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tour Map</h2>
          <div className="h-96">
            <MapView
              places={selectedTour.places}
              selectedPlaceId={selectedPlaceId}
              onPlaceSelect={(place) => setSelectedPlaceId(place.id)}
              height="100%"
            />
          </div>
        </div>
      )}

      {/* Places List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Places in this Tour</h2>

        {selectedTour.places.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No places added to this tour yet.</p>
            {isOwner && (
              <Button
                className="mt-4"
                onClick={() => navigate(`/tours/${id}/edit`)}
              >
                Add Places
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedTour.places.map((place) => (
              <div
                id={`place-${place.id}`}
                key={place.id}
                className={
                  selectedPlaceId === place.id
                    ? "ring-2 ring-primary rounded-lg"
                    : ""
                }
              >
                <PlaceCard
                  place={place}
                  onClick={() => setSelectedPlaceId(place.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back button */}
      <div className="mb-8">
        <Button variant="outline" onClick={handleBack}>
          ← Back to Tours
        </Button>
      </div>
    </Container>
  );
};

export default TourDetailsPage;
