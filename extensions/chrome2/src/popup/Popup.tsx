import React, { useState, useEffect } from 'react'

interface User {
  id: string
  email?: string
}

interface Message {
  type: string
  data: any
}

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

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const sendMessage = (message: Message): Promise<any> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve)
    })
  }

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

  if (loading) {
    return (
      <div className="popup-container">
        <div className="header">
          <h1>Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="popup-container">
      <div className="header">
        <h1>DatResume</h1>
        <p>AI Resume Assistant</p>
      </div>

      {error && <div className="error">{error}</div>}

      {!user ? (
        <form className="auth-form" onSubmit={handleAuth}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
          <button
            type="button"
            className="button secondary"
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          >
            {authMode === 'signin' ? 'Need an account?' : 'Have an account?'}
          </button>
        </form>
      ) : (
        <>
          <div className="user-info">
            <h3>Welcome!</h3>
            <p>{user.email}</p>
            <button className="button secondary" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          <div className="chat-section">
            <form className="chat-input" onSubmit={handleChatSubmit}>
              <input
                type="text"
                placeholder="Ask about your resume..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={chatLoading}
              />
              <button type="submit" disabled={chatLoading || !message.trim()}>
                {chatLoading ? '...' : 'Send'}
              </button>
            </form>

            {chatResponse && (
              <div className="success">
                <h4>AI Response:</h4>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>
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