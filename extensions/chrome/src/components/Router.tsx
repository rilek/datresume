import React from 'react'
import { useRouterStore, useAuthStore, Route } from '../stores'
import { AuthRoute, HomeRoute } from './routes'

export const Router: React.FC = () => {
  const { currentRoute } = useRouterStore()
  const { user } = useAuthStore()

  const renderRoute = (route: Route) => {
    if (!user) {
      return <AuthRoute />
    }

    switch (route) {
      case 'auth':
        return <AuthRoute />
      case 'home':
        return <HomeRoute />
      default:
        return <HomeRoute />
    }
  }

  return (
    <div className="flex-1">
      {renderRoute(currentRoute)}
    </div>
  )
}