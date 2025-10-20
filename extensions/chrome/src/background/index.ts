import { supabase } from '@/utils/supabase'

console.log('Background script loaded')

// Initialize Supabase session
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message, message.type)

  switch (message.type) {
    case 'SUPABASE_AUTH':
      handleSupabaseAuth(message.data)
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message }))
      return true // Will respond asynchronously

    case 'SUPABASE_QUERY':
      handleSupabaseQuery(message.data)
        .then(sendResponse)
        .catch((error) => sendResponse({ error: error.message }))
      return true

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

async function handleSupabaseQuery(data: any) {
  console.log("Handling Supabase query:", data);
  try {
    switch (data.action) {
      case 'select':
        let selectQuery: any = supabase.from(data.table)

        if (data.options?.columns) {
          selectQuery = selectQuery.select(data.options.columns)
        } else {
          selectQuery = selectQuery.select('*')
        }

        if (data.options?.filter) {
          Object.entries(data.options.filter).forEach(([key, value]) => {
            selectQuery = selectQuery.eq(key, value)
          })
        }

        if (data.options?.orderBy) {
          selectQuery = selectQuery.order(data.options.orderBy.column, {
            ascending: data.options.orderBy.ascending
          })
        }

        if (data.options?.limit) {
          selectQuery = selectQuery.limit(data.options.limit)
        }

        const { data: result, error } = await selectQuery
        if (error) throw error
        return { success: true, data: result }

      case 'insert':
        const { data: insertResult, error: insertError } = await supabase
          .from(data.table)
          .insert(data.data)
          .select()
        if (insertError) throw insertError
        return { success: true, data: insertResult }

      case 'update':
        let updateQuery: any = supabase.from(data.table).update(data.data)

        if (data.options?.filter) {
          Object.entries(data.options.filter).forEach(([key, value]) => {
            updateQuery = updateQuery.eq(key, value)
          })
        }

        const { data: updateResult, error: updateError } = await updateQuery.select()
        if (updateError) throw updateError
        return { success: true, data: updateResult }

      case 'delete':
        let deleteQuery: any = supabase.from(data.table).delete()

        if (data.options?.filter) {
          Object.entries(data.options.filter).forEach(([key, value]) => {
            deleteQuery = deleteQuery.eq(key, value)
          })
        }

        const { data: deleteResult, error: deleteError } = await deleteQuery
        if (deleteError) throw deleteError
        return { success: true, data: deleteResult }

      default:
        throw new Error('Unknown query action')
    }
  } catch (error) {
    console.error('Query error:', error)
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