import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Resume } from '../types/resume'

interface Message {
  type: string
  data: any
}

interface ResumeState {
  // State
  resumes: Resume[]
  currentResume: Resume | null
  loading: boolean
  error: string | null

  // Actions
  setResumes: (resumes: Resume[]) => void
  setCurrentResume: (resume: Resume | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Resume operations (read-only)
  fetchResumes: () => Promise<void>

  // Utility functions
  getDefaultResume: () => Resume | null
  clearResumes: () => void

  generateResume: (pageContent: string) => Promise<void>;
}

const sendMessage = (message: Message): Promise<any> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

export const useResumeStore = create<ResumeState>()(
  devtools(
    (set, get) => ({
      // Initial state
      resumes: [],
      currentResume: null,
      loading: false,
      error: null,

      // State setters
      setResumes: (resumes) => set({ resumes }, false, 'setResumes'),
      setCurrentResume: (currentResume) => set({ currentResume }, false, 'setCurrentResume'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),

      // Resume operations
      fetchResumes: async () => {
        set({ loading: true, error: null }, false, 'fetchResumes/start')

        try {
          const response = await sendMessage({
            type: 'SUPABASE_QUERY',
            data: {
              table: 'resumes',
              action: 'select',
              options: {
                orderBy: { column: 'updated_at', ascending: false }
              }
            }
          })

          if (response.error) {
            set({ error: response.error, loading: false }, false, 'fetchResumes/error')
          } else {
            const resumes = response.data || []
            const defaultResume = resumes.find((r: Resume) => r.is_default)

            set({
              resumes,
              currentResume: defaultResume || resumes[0] || null,
              loading: false
            }, false, 'fetchResumes/success')
          }
        } catch (error) {
          set({
            error: 'Failed to fetch resumes',
            loading: false
          }, false, 'fetchResumes/catch-error')
        }
      },

      // Utility functions
      getDefaultResume: () => {
        const { resumes } = get()
        return resumes.find(r => r.is_default) || null
      },

      clearResumes: () => set({
        resumes: [],
        currentResume: null,
        error: null
      }, false, 'clearResumes'),

      generateResume: async () => {
        set({ loading: true, error: null }, false, 'generateResume/start')

        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const [{ result: html }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id!},
            func: () => document.documentElement.outerHTML
          });

          const response = await sendMessage({
            type: 'SERVICE_GENERATE',
            data: { html }
          })

          if (response.error) {
            set({ error: response.error, loading: false }, false, 'generateResume/error')
          } else {
            set({ loading: false }, false, 'generateResume/success')
          }
        } catch (error) {
          console.log(error)
          set({
            error: 'Failed to generate resume',
            loading: false
          }, false, 'generateResume/catch-error')
        }
      }
    }),
    {
      name: 'resume-store'
    }
  )
)
