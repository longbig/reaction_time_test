import { createClient } from '@/utils/supabase/server'
import ReactionTimeGame from '@/components/reaction-time-game'
import AuthHeader from '@/components/auth-header'

export default async function Page() {
  const supabase = await createClient()
  let user = null

  if (supabase) {
    const { data } = await supabase.auth.getUser()
    user = data.user
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <AuthHeader user={user} />
      <ReactionTimeGame />
    </div>
  )
}
