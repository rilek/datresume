import { supabase } from '@/utils/supabase'

console.log('Background script loaded')

// Initialize Supabase session
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message)
  
  switch (message.type) {
    case 'SUPABASE_AUTH':
      handleSupabaseAuth(message.data)
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message }))
      return true // Will respond asynchronously
      
    case 'SUPABASE_FUNCTION':
      handleSupabaseFunction(message.data)
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message }))
      return true
      
    default:
      sendResponse({ error: 'Unknown message type' })
  }
})

async function handleSupabaseAuth(data: any) {
  try {
    switch (data.action) {
      case 'signIn':
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        
        if (error) throw error
        return { success: true, user: authData.user }
        
      case 'signUp':
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })
        
        if (signUpError) throw signUpError
        return { success: true, user: signUpData.user }
        
      case 'signOut':
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw signOutError
        return { success: true }
        
      case 'getUser':
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        return { user: userData.user }
        
      default:
        throw new Error('Unknown auth action')
    }
  } catch (error) {
    console.error('Auth error:', error)
    throw error
  }
}

async function handleSupabaseFunction(data: any) {
  try {
    const { data: result, error } = await supabase.functions.invoke(data.functionName, {
      body: data.payload,
    })
    
    if (error) throw error
    return { success: true, data: result }
  } catch (error) {
    console.error('Function error:', error)
    throw error
  }
}