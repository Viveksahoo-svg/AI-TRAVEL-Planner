import React from 'react';

const TransportationSelection = ({ transportation, setTransportation, errors, setErrors }) => {
  const transportationOptions = [
    { value: 'flight', emoji: '✈️', label: 'Flight', desc: 'Fast & convenient' },
    { value: 'train', emoji: '🚂', label: 'Train', desc: 'Scenic routes' },
    { value: 'bus', emoji: '🚌', label: 'Bus', desc: 'Economical travel' },
    { value: 'car', emoji: '🚗', label: 'Car', desc: 'Flexible & private' },
    { value: 'bike', emoji: '🚲', label: 'Bike', desc: 'Eco-friendly' },
    { value: 'boat', emoji: '⛵', label: 'Boat', desc: 'Water adventures' },
    { value: 'walking', emoji: '🚶', label: 'Walking', desc: 'Explore on foot' },
    { value: 'public', emoji: '🚇', label: 'Public Transit', desc: 'Local experience' },
  ];

  const toggleTransportation = (value) => {
    setTransportation((prev) => {
      const newTransportation = prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value];
      setErrors((prev) => ({ ...prev, transportation: '' }));
      return newTransportation;
    });
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-3">
        How would you like to get around? (Select all that apply)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {transportationOptions.map(({ value, emoji, label, desc }) => (
          <div
            key={value}
            onClick={() => toggleTransportation(value)}
            className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
              transportation.includes(value)
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
      {errors.transportation && <p className="mt-2 text-sm text-red-500">{errors.transportation}</p>}
    </div>
  );
};

export default TransportationSelection; 