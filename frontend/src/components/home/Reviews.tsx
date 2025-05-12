import React from 'react';

const reviews = [
  {
    name: 'John Doe',
    location: 'Berlin, Germany',
    rating: 5,
    text: 'The AI-generated tour was perfect for my one-day visit to Skopje. It included all the major attractions while still giving me time to explore the local cuisine. Highly recommended!',
  },
  {
    name: 'Joana Doe',
    location: 'Zurich, Switzerland',
    rating: 5,
    text: 'As a history enthusiast, I was impressed by how well the tour balanced historical sites with modern attractions. The Stone Bridge and Fortress were highlights of my trip.',
  },
];

const Reviews: React.FC = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What Travelers Say</h2>
        <p className="text-gray-600 mb-10">
          Hear from visitors who explored Skopje with our AI-powered tour planner
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-6 shadow rounded text-left">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.location}</p>
                </div>
              </div>
              <div className="flex items-center text-yellow-400 text-sm mb-3">
                {'★'.repeat(review.rating)}
              </div>
              <p className="text-sm text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
