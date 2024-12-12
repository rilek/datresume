import supabase from '../../utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex items-center justify-center">
    <div className="w-96">
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </div>
  </div>
}
