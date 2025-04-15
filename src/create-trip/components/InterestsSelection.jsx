import React from 'react';

const InterestsSelection = ({ interests, setInterests, errors, setErrors }) => {
  const interestOptions = [
    { value: 'adventure', emoji: '🏔️', label: 'Adventure', desc: 'Thrilling outdoor activities' },
    { value: 'culture', emoji: '🏛️', label: 'Culture', desc: 'Historical and cultural experiences' },
    { value: 'foodie', emoji: '🍜', label: 'Foodie', desc: 'Culinary delights and local cuisine' },
    { value: 'relaxation', emoji: '🏖️', label: 'Relaxation', desc: 'Peaceful and rejuvenating experiences' },
    { value: 'shopping', emoji: '🛍️', label: 'Shopping', desc: 'Retail therapy and local markets' },
    { value: 'nightlife', emoji: '🌃', label: 'Nightlife', desc: 'Evening entertainment and social scene' },
  ];

  const toggleInterest = (value) => {
    setInterests((prev) => {
      const newInterests = prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value];
      setErrors((prev) => ({ ...prev, interests: '' }));
      return newInterests;
    });
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-3">
        Travel Style (Select all that apply)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {interestOptions.map(({ value, emoji, label, desc }) => (
          <div
            key={value}
            onClick={() => toggleInterest(value)}
            className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
              interests.includes(value)
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
      {errors.interests && <p className="mt-2 text-sm text-red-500">{errors.interests}</p>}
    </div>
  );
};

export default InterestsSelection; 