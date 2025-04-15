import React from 'react';

const ActivitiesSelection = ({ activities, setActivities, errors, setErrors }) => {
  const activityOptions = [
    { value: 'sightseeing', emoji: '🏛️', label: 'Sightseeing', desc: 'Explore landmarks' },
    { value: 'hiking', emoji: '🥾', label: 'Hiking', desc: 'Nature trails' },
    { value: 'beach', emoji: '🏖️', label: 'Beach', desc: 'Coastal activities' },
    { value: 'shopping', emoji: '🛍️', label: 'Shopping', desc: 'Retail therapy' },
    { value: 'food', emoji: '🍽️', label: 'Food', desc: 'Culinary experiences' },
    { value: 'culture', emoji: '🎭', label: 'Culture', desc: 'Arts & heritage' },
    { value: 'adventure', emoji: '🏄', label: 'Adventure', desc: 'Thrill seeking' },
    { value: 'relaxation', emoji: '🧘', label: 'Relaxation', desc: 'Wellness & spa' },
    { value: 'nightlife', emoji: '🌃', label: 'Nightlife', desc: 'Evening entertainment' },
  ];

  const toggleActivity = (value) => {
    setActivities((prev) => {
      const newActivities = prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value];
      setErrors((prev) => ({ ...prev, activities: '' }));
      return newActivities;
    });
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-3">
        What activities interest you? (Select all that apply)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {activityOptions.map(({ value, emoji, label, desc }) => (
          <div
            key={value}
            onClick={() => toggleActivity(value)}
            className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
              activities.includes(value)
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
      {errors.activities && <p className="mt-2 text-sm text-red-500">{errors.activities}</p>}
    </div>
  );
};

export default ActivitiesSelection; 