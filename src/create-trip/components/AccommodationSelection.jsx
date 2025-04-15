import React from 'react';

const AccommodationSelection = ({ accommodation, setAccommodation, errors, setErrors }) => {
  const accommodationOptions = [
    { value: 'hotel', emoji: '🏨', label: 'Hotel', desc: 'Comfort & service' },
    { value: 'hostel', emoji: '🛏️', label: 'Hostel', desc: 'Budget friendly' },
    { value: 'apartment', emoji: '🏢', label: 'Apartment', desc: 'Home away from home' },
    { value: 'resort', emoji: '🏖️', label: 'Resort', desc: 'All-inclusive luxury' },
    { value: 'villa', emoji: '🏡', label: 'Villa', desc: 'Private & spacious' },
    { value: 'cabin', emoji: '🏠', label: 'Cabin', desc: 'Rustic charm' },
    { value: 'camping', emoji: '⛺', label: 'Camping', desc: 'Close to nature' },
    { value: 'boutique', emoji: '🏩', label: 'Boutique', desc: 'Unique & stylish' },
  ];

  const toggleAccommodation = (value) => {
    setAccommodation((prev) => {
      const newAccommodation = prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value];
      setErrors((prev) => ({ ...prev, accommodation: '' }));
      return newAccommodation;
    });
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-3">
        Where would you like to stay? (Select all that apply)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {accommodationOptions.map(({ value, emoji, label, desc }) => (
          <div
            key={value}
            onClick={() => toggleAccommodation(value)}
            className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
              accommodation.includes(value)
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
      {errors.accommodation && <p className="mt-2 text-sm text-red-500">{errors.accommodation}</p>}
    </div>
  );
};

export default AccommodationSelection; 