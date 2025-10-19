import React, { useState, useEffect, ComponentProps } from 'react'
import logo from "./logo.svg"
import clsx from 'clsx'
import { cva, VariantProps } from 'class-variance-authority'

interface User {
  id: string
  email?: string
}

interface Message {
  type: string
  data: any
}


const sendMessage = (message: Message): Promise<any> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

const buttonClasses = cva(
  "cursor-pointer font-medium py-2 px-4 rounded-md transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sky-200 hover:bg-sky-400 disabled:bg-gray-400 text-sky-950",
        secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900",
        success: "bg-green-200 hover:bg-green-300 disabled:bg-green-100 text-green-900",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const Button = ({ variant, className, ...props }: ComponentProps<"button"> & VariantProps<typeof buttonClasses>) =>
  <button {...props} className={clsx(buttonClasses({ variant, className }))} />

const Popup: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [chatResponse, setChatResponse] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const checkAuthStatus = async () => {
    try {
      const response = await sendMessage({
        type: 'SUPABASE_AUTH',
        data: { action: 'getUser' }
      })

      if (response.user) {
        setUser(response.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await sendMessage({
        type: 'SUPABASE_AUTH',
        data: {
          action: authMode === 'signin' ? 'signIn' : 'signUp',
          email,
          password
        }
      })

      if (response.error) {
        setError(response.error)
      } else if (response.success) {
        setUser(response.user)
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await sendMessage({
        type: 'SUPABASE_AUTH',
        data: { action: 'signOut' }
      })
      setUser(null)
    } catch (error) {
      setError('Sign out failed')
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setChatLoading(true)
    setChatResponse(null)
    setError(null)

    try {
      const response = await sendMessage({
        type: 'SUPABASE_FUNCTION',
        data: {
          functionName: 'chat',
          payload: { message: message.trim() }
        }
      })

      if (response.error) {
        setError(response.error)
      } else {
        setChatResponse(JSON.stringify(response.data, null, 2))
      }
    } catch (error) {
      setError('Chat request failed')
    } finally {
      setChatLoading(false)
      setMessage('')
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

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
    <div className="w-[350px] px-8 py-8 bg-gray-50 flex flex-col gap-4">
      <div className="text-center mb-4">
        <h1 className="mb-2 mx-auto text-center"><img src={logo} alt="" className='inline-block' /></h1>
        <p className="text-sm text-gray-600">Login to generate perfect resume</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {!user ? (
        <form className="flex flex-col gap-3" onSubmit={handleAuth}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          >
            {authMode === 'signin' ? 'Need an account?' : 'Have an account?'}
          </Button>
        </form>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Welcome!</h3>
            <p className="text-xs text-gray-600 mb-3">{user.email}</p>
            <Button
              variant={"secondary"}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <form className="flex gap-2" onSubmit={handleChatSubmit}>
              <input
                type="text"
                placeholder="Ask about your resume..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={chatLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
              />
              <Button
                type="submit"
                disabled={chatLoading || !message.trim()}
                variant={"success"}
              >
                {chatLoading ? '...' : 'Send'}
              </Button>
            </form>

            {chatResponse && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                <h4 className="font-medium mb-2">AI Response:</h4>
                <pre className="whitespace-pre-wrap text-xs font-mono">
                  {chatResponse}
                </pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Popup