import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNav from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#f4f1eb] flex flex-col">
      <AdminNav />
      <main className="flex-1 container-site py-8">{children}</main>
    </div>
  )
}
