// Resume types based on Supabase schema
export interface Resume {
  id: string
  name: string
  content: any // JSON content of the resume
  is_default: boolean
  user_id: string
  created_at: string
  updated_at: string | null
}
