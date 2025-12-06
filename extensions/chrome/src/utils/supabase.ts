import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: {
      getItem: (key: string) => {
        return new Promise((resolve) => {
          chrome.storage.local.get([key], (result) => {
            resolve(result[key] || null)
          })
        })
      },
      setItem: (key: string, value: string) => {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, () => {
            resolve()
          })
        })
      },
      removeItem: (key: string) => {
        return new Promise((resolve) => {
          chrome.storage.local.remove([key], () => {
            resolve()
          })
        })
      },
    },
  },
})

export type Database = any // You can import your Database type here

export { supabaseUrl, supabaseKey }
