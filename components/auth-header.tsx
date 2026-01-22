"use client"

import { User } from '@supabase/supabase-js'
import GoogleSignIn from './google-signin'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
        <Link href="/" className="text-2xl font-bold text-foreground">
          Reaction Time Test
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/pricing">Pricing</Link>
          </Button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/account">Account</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex"
              >
                <a
                  href="https://www.paypal.com/ncp/payment/RVTU29PW4FVH4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upgrade
                </a>
              </Button>
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
