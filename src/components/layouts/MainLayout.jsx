import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../custom/Header';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout; 