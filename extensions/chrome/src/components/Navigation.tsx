import React from 'react'
import { useAuthStore } from '../stores'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'


export const Navigation: React.FC = () => {
  const { user, signOut } = useAuthStore()

  if (!user) { return <></> }

  return (
    <Button variant={"secondary"} size={"icon"} title="Logout" onClick={signOut}><LogOutIcon /></Button>
  )
}