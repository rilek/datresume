import React from 'react'
import { useRouterStore, Route } from '../stores'
import { AuthRoute, ChatRoute } from './routes'
import { useAuth } from '@/hooks';

export const Router: React.FC = () => {
  const { currentRoute } = useRouterStore();
  const { isAuthenticated } = useAuth();


  const renderRoute = (route: Route) => {
    if (!isAuthenticated)
      return <AuthRoute />

    switch (route) {
      case 'auth':
        return <AuthRoute />
      case 'home':
        return <ChatRoute />
      default:
        return <AuthRoute />
    }
  }

  return (
    <div className="flex-1">
      {renderRoute(currentRoute)}
    </div>
  )
}