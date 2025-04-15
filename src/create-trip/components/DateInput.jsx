import React from 'react';

const DateInput = ({ startDate, setStartDate, errors, setErrors }) => {
  return (
    <div>
      <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
        Start Date
      </label>
      <input
        id="startDate"
        name="startDate"
        type="date"
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          setErrors((prev) => ({ ...prev, startDate: '' }));
        }}
        min={new Date().toISOString().split('T')[0]}
        className={`mt-2 block w-full rounded-lg border ${
          errors.startDate ? 'border-red-500' : 'border-gray-300'
        } bg-gray-50 p-3 text-sm focus:border-primary focus:ring-primary transition`}
      />
      {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
    </div>
  );
};

export default DateInput; 