import React from 'react';

const CompanionsSelection = ({ companions, setCompanions, errors, setErrors }) => {
  const companionOptions = [
    { value: 'solo', emoji: '✈️', label: 'Just Me', desc: 'A sole traveler in exploration' },
    { value: 'couple', emoji: '🥂', label: 'A Couple', desc: 'Two travelers in tandem' },
    { value: 'family', emoji: '🏡', label: 'Family', desc: 'A group of fun-loving adventurers' },
    { value: 'friends', emoji: '⛵', label: 'Friends', desc: 'A bunch of thrill-seekers' },
  ];

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-3">
        Who do you plan on traveling with on your next adventure?
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companionOptions.map(({ value, emoji, label, desc }) => (
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
  );
};

export default CompanionsSelection; 