import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import destinations from '../data/destinations.json';
import { useNavigate } from 'react-router-dom';
import DestinationInput from './components/DestinationInput';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAuth } from '../context/AuthContext';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../sevices/firebaseConfig';

function CreateTrip() {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '1',
    budget: 'medium',
    interests: [],
  });
  const [days, setDays] = useState('');
  const [companions, setCompanions] = useState('');
  const [travelStyles, setTravelStyles] = useState([]);
  const [errors, setErrors] = useState({});
  const [tripPlan, setTripPlan] = useState(null);
  const [destinationData, setDestinationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Check authentication on component mount
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the form
  if (!user) {
    return null;
  }

  const saveAitrip = async (tripData) => {
    try {
      if (!user || !user.email) {
        console.error('User not authenticated:', user);
        throw new Error('User not authenticated');
      }

      // Generate a unique document ID using timestamp
      const docId = Date.now().toString();
      
      // Prepare the data to save
      const tripDataToSave = {
        ...tripData,
        userId: user.email, 
        userEmail: user.email,
        userName: user.name,
        createdAt: new Date().toISOString(),
      };

      console.log('Saving trip data:', tripDataToSave);

      // Save to Firebase
      await setDoc(doc(db, 'trips', docId), tripDataToSave);

      // Save to localStorage with a specific key
      const localStorageKey = `travelPlanner_trips_${user.email}`;
      const savedTrips = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
      savedTrips.push({
        id: docId,
        ...tripDataToSave
      });
      localStorage.setItem(localStorageKey, JSON.stringify(savedTrips));

      return docId;
    } catch (error) {
      console.error('Error saving trip:', error);
      throw new Error('Failed to save trip: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user || !user.email) {
      console.error('User not authenticated:', user);
      setError('Please sign in to create a trip');
      navigate('/signin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Create a detailed travel plan for ${formData.destination} from ${formData.startDate} to ${formData.endDate} for ${formData.travelers} ${formData.travelers === '1' ? 'person' : 'people'} with a ${formData.budget} budget. Include daily activities, recommended accommodations, must-visit attractions, local food recommendations, transportation tips, and packing suggestions.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Prepare trip data
      const tripData = {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        budget: formData.budget,
        interests: formData.interests,
        tripPlan: text,
        days: days,
        companions: companions,
        travelStyles: travelStyles,
        destinationData: destinationData || null,
        userId: user.email,
        userEmail: user.email,
        userName: user.name,
        createdAt: new Date().toISOString()
      };

      // Log trip details
      console.log('Trip Details:', {
        ...tripData,
        tripPlan: text.substring(0, 100) + '...' // Log first 100 chars of plan
      });

      // Save trip to Firebase
      const tripId = await saveAitrip(tripData);
      console.log('Trip saved with ID:', tripId);
      
      // Navigate to trip-details with the trip data
      navigate('/trip-details', { 
        state: { 
          trip: {
            ...tripData,
            id: tripId,
            images: destinationData?.images || [],
            description: destinationData?.description || '',
            highlights: destinationData?.highlights || [],
            activities: destinationData?.activities || []
          }
        } 
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate trip plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestinationChange = (e) => {
    setFormData(prev => ({
      ...prev,
      destination: e.target.value
    }));
    setErrors(prev => ({ ...prev, destination: '' }));
  };

  const generateTripPlan = async () => {
  setIsLoading(true);
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    // Find matching destination from JSON data
    const matchingDestination = destinations.destinations.find(
      (dest) => dest.name.toLowerCase() === formData.destination.toLowerCase()
    );

    if (!matchingDestination) {
      throw new Error('Destination not found in our database');
    }

    setDestinationData(matchingDestination);

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `Create a detailed travel plan for ${formData.destination} for ${days} days starting from ${formData.startDate}. 
    Budget: ${formData.budget}
    Travel companions: ${companions}
    Travel styles: ${travelStyles.join(', ')}

    Please provide:
    1. Daily itinerary
    2. Recommended accommodations
    3. Must-visit attractions
    4. Local food recommendations
    5. Transportation tips
    6. Budget breakdown
    7. Packing suggestions`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    setTripPlan(text);

    navigate('/trip-details', {
      state: {
        tripPlan: text,
        destinationData: matchingDestination
      }
    });
  } catch (error) {
    console.error('Error generating trip plan:', error);
    setErrors(prev => ({ ...prev, api: 'Failed to generate trip plan. Please try again.' }));
  } finally {
    setIsLoading(false);
  }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destination) newErrors.destination = 'Please enter a destination';
    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.startDate < today) newErrors.startDate = 'Start date cannot be in the past';
    }
    if (!days) newErrors.days = 'Please enter the number of days';
    else if (days < 1) newErrors.days = 'Number of days must be at least 1';
    else if (!Number.isInteger(Number(days))) newErrors.days = 'Number of days must be a whole number';
    if (!formData.budget) newErrors.budget = 'Please select a budget';
    if (!companions) newErrors.companions = 'Please select travel companions';
    if (travelStyles.length === 0) newErrors.travelStyles = 'Please select at least one travel style';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <section className="w-full min-h-screen py-10 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-1 space-y-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center">
          Plan Your Perfect Trip! 🏕️
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <DestinationInput
            value={formData.destination}
            onChange={handleDestinationChange}
            error={errors.destination}
          />
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, startDate: e.target.value }));
                setErrors((prev) => ({ ...prev, startDate: '' }));
              }}
              min={new Date().toISOString().split('T')[0]}
              className={`mt-2 block w-full rounded-lg border ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              } bg-gray-50 p-3 text-sm focus:border-primary focus:ring-primary transition`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
          </div>
          <div>
            <label htmlFor="days" className="block text-sm font-semibold text-gray-700">
              Number of Days
            </label>
            <input
              id="days"
              name="days"
              type="number"
              value={days}
              onChange={(e) => {
                setDays(e.target.value);
                setErrors((prev) => ({ ...prev, days: '' }));
              }}
              placeholder="Ex. 3"
              min="1"
              className={`mt-2 block w-full rounded-lg border ${
                errors.days ? 'border-red-500' : 'border-gray-300'
              } bg-gray-50 p-3 text-sm focus:border-primary focus:ring-primary transition`}
            />
            {errors.days && <p className="mt-1 text-sm text-red-500">{errors.days}</p>}
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-3">What is Your Budget?</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'cheap', emoji: '💵', label: 'Cheap', desc: 'Stay conscious of costs' },
                { value: 'moderate', emoji: '💰', label: 'Moderate', desc: 'Keep costs average' },
                { value: 'luxury', emoji: '💸', label: 'Luxury', desc: 'No cost worries' },
              ].map(({ value, emoji, label, desc }) => (
                <div
                  key={value}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, budget: value }));
                    setErrors((prev) => ({ ...prev, budget: '' }));
                  }}
                  className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
                    formData.budget === value
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <h3 className="mt-2 font-semibold text-gray-800">{label}</h3>
                  <p className="mt-1 text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            {errors.budget && <p className="mt-2 text-sm text-red-500">{errors.budget}</p>}
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-3">
              Who do you plan on traveling with on your next adventure?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: 'solo', emoji: '✈️', label: 'Just Me', desc: 'A sole traveler in exploration' },
                { value: 'couple', emoji: '🥂', label: 'A Couple', desc: 'Two travelers in tandem' },
                { value: 'family', emoji: '🏡', label: 'Family', desc: 'A group of fun-loving adventurers' },
                { value: 'friends', emoji: '⛵', label: 'Friends', desc: 'A bunch of thrill-seekers' },
              ].map(({ value, emoji, label, desc }) => (
                <div
                  key={value}
                  onClick={() => {
                    setCompanions(value);
                    setErrors((prev) => ({ ...prev, companions: '' }));
                  }}
                  className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
                    companions === value
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <h3 className="mt-2 font-semibold text-gray-800">{label}</h3>
                  <p className="mt-1 text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            {errors.companions && <p className="mt-2 text-sm text-red-500">{errors.companions}</p>}
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-700 mb-3">
              Travel Style (Select all that apply)
            </span>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {['Adventure', 'Relaxation', 'Culture', 'Foodie'].map((style) => (
                <label key={style} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`travelStyle-${style.toLowerCase()}`}
                    name="travelStyles"
                    value={style.toLowerCase()}
                    checked={travelStyles.includes(style.toLowerCase())}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTravelStyles([...travelStyles, style.toLowerCase()]);
                      } else {
                        setTravelStyles(travelStyles.filter((s) => s !== style.toLowerCase()));
                      }
                      setErrors((prev) => ({ ...prev, travelStyles: '' }));
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">{style}</span>
                </label>
              ))}
            </div>
            {errors.travelStyles && <p className="mt-2 text-sm text-red-500">{errors.travelStyles}</p>}
          </div>
          <div className="flex justify-center my-9 mb-6">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full sm:w-auto font-semibold py-3 px-6 rounded-lg transition"
              disabled={isLoading}
            >
              {isLoading ? 'Generating Plan...' : 'Generate Trip Plan'}
            </Button>
          </div>
          {tripPlan && destinationData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Trip Plan</h2>
              <div className="prose max-w-none">
                {tripPlan.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-600 mb-2">{line}</p>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {destinationData.images && destinationData.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={image.url} 
                      alt={image.description}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 bg-white">
                      <p className="text-sm text-gray-600">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default CreateTrip;