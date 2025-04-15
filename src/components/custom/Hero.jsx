import React from 'react'
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center">
      <img
        src="https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Travel destination"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
          {user ? 'Plan Your Next Adventure' : 'Discover Your Next Adventure'}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto">
          {user 
            ? 'Create personalized travel plans with AI-powered insights.'
            : 'Sign in to create personalized travel plans with AI-powered insights.'
          }
        </p>
        
        {user ? (
          <Link to={'/create-trip'}>
            <Button className='px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-md'>
              Create New Trip
            </Button>
          </Link>
        ) : (
          <Link to={'/signin'}>
            <Button className='px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-md'>
              Sign In to Get Started
            </Button>
          </Link>
        )}
      </div>
      <div className="absolute inset-0 bg-black opacity-40"></div>
    </section>
  );
}

export default Hero