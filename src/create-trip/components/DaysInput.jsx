import React from 'react';

const DaysInput = ({ days, setDays, errors, setErrors }) => {
  return (
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
  );
};

export default DaysInput; 