import { createClient } from '@/utils/supabase/server'
import AuthHeader from '@/components/auth-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function formatDate(d?: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString()
  } catch {
    return d
  }
}

export default async function AccountPage() {
  const supabase = await createClient()
  let user = null as any
  let profile: { email: string | null; membership_start: string | null; membership_end: string | null } | null = null

  if (supabase) {
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (user) {
      const { data: p } = await supabase
        .from('profiles')
        .select('email, membership_start, membership_end')
        .eq('id', user.id)
        .maybeSingle()

      profile = p
    }
  }

  const isActive = !!profile?.membership_end && new Date(profile.membership_end) > new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <AuthHeader user={user} />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>请先登录</CardTitle>
              <CardDescription>使用 Google 登录后可查看会员信息。</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">点击右上角进行登录。</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>个人中心</CardTitle>
              <CardDescription>查看您的账号与会员状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">登录邮箱</span>
                  <span className="font-medium">{profile?.email ?? user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">会员开通时间</span>
                  <span className="font-medium">{formatDate(profile?.membership_start)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">会员到期时间</span>
                  <span className="font-medium">{formatDate(profile?.membership_end)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">当前状态</span>
                  <span className={isActive ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                    {isActive ? '已开通' : '未开通'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

