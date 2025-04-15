import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'
import CreateTrip from './create-trip/CreateTrip.jsx'
import TripDetails from './trip-details/TripDetails.jsx'
import SignIn from './auth/SignIn.jsx'
import Register from './auth/Register.jsx'
import MyTrips from './pages/MyTrips.jsx'
import MainLayout from './components/layouts/MainLayout'

// Get the client ID from environment variables
const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

if (!clientId) {
  console.error('Google OAuth Client ID is missing. Please check your .env file.');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider 
      clientId={clientId}
      onScriptLoadError={() => console.error('Failed to load Google OAuth script')}
      onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<App />} />
              <Route path="create-trip" element={<CreateTrip />} />
              <Route path="trip-details" element={<TripDetails />} />
              <Route path="my-trips" element={<MyTrips />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
