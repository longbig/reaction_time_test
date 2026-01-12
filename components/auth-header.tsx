'use client'

import { User } from '@supabase/supabase-js'
import GoogleSignIn from './google-signin'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthHeader({ user }: { user: User | null }) {
  const router = useRouter()
  const handleSignOut = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
      router.refresh()
    }
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Reaction Time Test</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{user.email}</span>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="w-[200px]">
                <GoogleSignIn />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
