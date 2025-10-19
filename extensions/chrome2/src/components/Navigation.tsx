import React from 'react'
import { useAuth } from '../hooks'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'


export const Navigation: React.FC = () => {
  const { isAuthenticated, signOut } = useAuth()

  if (!isAuthenticated) { return <></> }

  return (
    <Button variant={"secondary"} size={"icon"} title="Logout" onClick={signOut}><LogOutIcon /></Button>
  )
}