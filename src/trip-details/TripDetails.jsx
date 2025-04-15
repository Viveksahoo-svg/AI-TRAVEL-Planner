import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function TripDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tripPlan, destinationData } = location.state || {};

  if (!tripPlan || !destinationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Trip Plan Found</h1>
          <p className="text-gray-600 mb-6">Please create a trip plan first.</p>
          <Button 
            onClick={() => navigate('/create-trip')} 
            variant="default"
          >
            Create New Trip
          </Button>
        </div>
      </div>
    );
  }

  // Split the trip plan into sections
  const sections = tripPlan.split('\n\n').filter(section => section.trim());

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with destination images */}
          <div className="relative h-64">
            {destinationData.images && destinationData.images[0] && (
              <img
                src={destinationData.images[0].url}
                alt={destinationData.images[0].description}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center">
                {destinationData.name} Trip Plan
              </h1>
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-6">
            {sections.map((section, index) => {
              // Check if this is a section header
              const isHeader = section.match(/^\d+\./);
              const content = isHeader ? section.replace(/^\d+\.\s*/, '') : section;

              return (
                <div key={index} className="mb-8">
                  {isHeader ? (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{content}</h2>
                  ) : (
                    <div className="prose max-w-none">
                      {content.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className="text-gray-600 mb-2">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Additional Images */}
            {destinationData.images && destinationData.images.length > 1 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Destination Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destinationData.images.slice(1).map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md">
                      <img
                        src={image.url}
                        alt={image.description}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 bg-white">
                        <p className="text-sm text-gray-600">{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/create-trip')}
                variant="default"
              >
                Create Another Trip
              </Button>
              <Button
                onClick={() => navigate('/my-trips')}
                variant="secondary"
              >
                View All Trips
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetails; 