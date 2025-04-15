import React from 'react';

const BudgetSelection = ({ budget, setBudget, errors, setErrors }) => {
  const budgetOptions = [
    { value: 'cheap', emoji: '💵', label: 'Cheap', desc: 'Stay conscious of costs' },
    { value: 'moderate', emoji: '💰', label: 'Moderate', desc: 'Keep costs average' },
    { value: 'luxury', emoji: '💸', label: 'Luxury', desc: 'No cost worries' },
  ];

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-3">What is Your Budget?</span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {budgetOptions.map(({ value, emoji, label, desc }) => (
          <div
            key={value}
            onClick={() => {
              setBudget(value);
              setErrors((prev) => ({ ...prev, budget: '' }));
            }}
            className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${
              budget === value
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
  );
};

export default BudgetSelection; 