import React from 'react';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Travel Planner
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Plan your perfect trip with AI
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout; 