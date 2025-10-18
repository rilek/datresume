import React, { useState, useEffect } from 'react'

const Options: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['supabaseUrl', 'supabaseKey'], (result) => {
      if (result.supabaseUrl) setSupabaseUrl(result.supabaseUrl)
      if (result.supabaseKey) setSupabaseKey(result.supabaseKey)
    })
  }, [])

  const handleSave = () => {
    chrome.storage.sync.set({
      supabaseUrl,
      supabaseKey,
    }, () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div>
      <div className="section">
        <h2>Supabase Configuration</h2>
        <p>Configure your Supabase connection settings</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Supabase URL
          </label>
          <input
            type="url"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Supabase Anon Key
          </label>
          <input
            type="password"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="Your Supabase anon key"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: '10px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Save Settings
        </button>

        {saved && (
          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: '#f0fdf4',
            color: '#16a34a',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="section">
        <h2>About</h2>
        <p>DatResume Chrome Extension v1.0.0</p>
        <p>AI-powered resume assistant with Supabase backend integration.</p>
      </div>
    </div>
  )
}

export default Options