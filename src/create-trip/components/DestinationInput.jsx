import React, { useState } from 'react';
import destinations from '../../data/destinations.json';

const DestinationInput = ({ value, onChange, error }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const availableDestinations = destinations.destinations.map(dest => dest.name);

  const filteredSuggestions = availableDestinations.filter(dest =>
    dest.toLowerCase().includes(value.toLowerCase())
  );

  const handleInput = (e) => {
    onChange(e);
    setShowSuggestions(true);
  };

  const handleSelect = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };

  return (
    <div className="mb-4">
      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
        Destination
      </label>
      <div className="relative">
        <input
          type="text"
          id="destination"
          value={value}
          onChange={handleInput}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your destination"
        />
        {showSuggestions && value && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DestinationInput; 