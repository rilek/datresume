import React, { useEffect } from 'react'
import logo from "./logo.svg"
import { useAuth, useRouter } from '../hooks'
import { Navigation } from '@/components/Navigation'
import { Router } from '@/components/Router'

const Popup: React.FC = () => {
  const { loading, checkAuthStatus, isAuthenticated } = useAuth()
  const { currentRoute, navigate } = useRouter()

  // Auto-navigate based on auth state
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // Navigate to chat after successful authentication
  useEffect(() => {
    if (isAuthenticated && currentRoute === 'auth') {
      navigate('home')
    }
  }, [isAuthenticated, currentRoute, navigate])

  if (loading) {
    return (
      <div className="w-[350px] h-[500px] p-4 bg-gray-50">
        <div className="text-center mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[350px] px-6 py-6 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='shrink-0'>
          <img src={logo} alt="DatResume" className='inline-block' />
        </h1>

        <Navigation />
      </div>

      <Router />
    </div>
  )
}

export default Popup