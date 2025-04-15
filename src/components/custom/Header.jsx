import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className='p-4 sm:p-5 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center px-4 sm:px-20 relative'>
      <div className='w-full sm:w-auto flex justify-between items-center'>
        <Link to="/" className='flex-shrink-0'>
          <img src="/Logo.svg" alt="logo svg" className='h-8 sm:h-10' />
        </Link>
        <button
          className='sm:hidden p-2'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto mt-4 sm:mt-0`}>
        {user ? (
          <div className="relative w-full sm:w-auto">
            <Button
              variant="default"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{maskEmail(user.email)}</span>
            </Button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/signin" className="w-full sm:w-auto">
              <Button variant="default" className="w-full sm:w-auto">Sign In</Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="default" className="w-full sm:w-auto">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Header