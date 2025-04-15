import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../sevices/firebaseConfig';
import { Button } from '../components/ui/button';

function MyTrips() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      
      try {
        const tripsRef = collection(db, 'trips');
        const q = query(tripsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const tripsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTrips(tripsData);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <Button onClick={() => navigate('/create-trip')}>
            Create New Trip
          </Button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600">No trips yet</h2>
            <p className="mt-2 text-gray-500">Create your first trip to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {trip.destination}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/trip-details', { state: { trip } })}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips; 