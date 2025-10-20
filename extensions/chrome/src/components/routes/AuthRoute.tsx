import React, { useState } from 'react'
import { useAuthStore } from '../../stores'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export const AuthRoute: React.FC = () => {
  const {
    user,
    loading,
    error,
    signIn,
    signOut
  } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await signIn(email, password);

    if (success) {
      setEmail('')
      setPassword('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleAuth}>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            Sign In
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={()=> chrome.tabs.create({ url: `${import.meta.env.VITE_APP_URL}/signup` })}
          >
            Need an account?
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Welcome!</h3>
      <p className="text-xs text-gray-600 mb-3">{user.email}</p>
      <Button
        variant="secondary"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  )
}