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
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">DatResume Extension Settings</h1>
        <p className="text-gray-600">Configure your AI resume assistant</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Supabase Configuration</h2>
        <p className="text-gray-600 mb-6">Configure your Supabase connection settings</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supabase URL
          </label>
          <input
            type="url"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supabase Anon Key
          </label>
          <input
            type="password"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="Your Supabase anon key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Save Settings
        </button>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm mt-3">
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
        <p className="text-gray-600 mb-2">DatResume Chrome Extension v1.0.0</p>
        <p className="text-gray-600">AI-powered resume assistant with Supabase backend integration.</p>
      </div>
    </div>
  )
}

export default Options