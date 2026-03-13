import AdminNav from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f1eb] flex flex-col">
      <AdminNav />
      <main className="flex-1 container-site py-8">{children}</main>
    </div>
  )
}
