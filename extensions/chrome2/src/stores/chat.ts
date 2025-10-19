import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Message {
  type: string
  data: any
}

interface ChatState {
  // State
  message: string
  chatResponse: string | null
  chatLoading: boolean
  error: string | null
  
  // Actions
  setMessage: (message: string) => void
  setChatResponse: (response: string | null) => void
  setChatLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Chat operations
  sendChatMessage: (message: string) => Promise<void>
  clearChat: () => void
}

const sendMessage = (message: Message): Promise<any> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      // Initial state
      message: '',
      chatResponse: null,
      chatLoading: false,
      error: null,
      
      // State setters
      setMessage: (message) => set({ message }, false, 'setMessage'),
      setChatResponse: (chatResponse) => set({ chatResponse }, false, 'setChatResponse'),
      setChatLoading: (chatLoading) => set({ chatLoading }, false, 'setChatLoading'),
      setError: (error) => set({ error }, false, 'setError'),
      
      // Chat operations
      sendChatMessage: async (message: string) => {
        if (!message.trim()) return
        
        set({ 
          chatLoading: true, 
          chatResponse: null, 
          error: null 
        }, false, 'sendChatMessage/start')

        try {
          const response = await sendMessage({
            type: 'SUPABASE_FUNCTION',
            data: {
              functionName: 'chat',
              payload: { message: message.trim() }
            }
          })

          if (response.error) {
            set({ 
              error: response.error, 
              chatLoading: false 
            }, false, 'sendChatMessage/error')
          } else {
            set({ 
              chatResponse: JSON.stringify(response.data, null, 2), 
              chatLoading: false,
              message: '' // Clear the input message
            }, false, 'sendChatMessage/success')
          }
        } catch (error) {
          set({ 
            error: 'Chat request failed', 
            chatLoading: false 
          }, false, 'sendChatMessage/catch-error')
        }
      },
      
      clearChat: () => set({ 
        message: '', 
        chatResponse: null, 
        error: null 
      }, false, 'clearChat')
    }),
    {
      name: 'chat-store', // for devtools
    }
  )
)