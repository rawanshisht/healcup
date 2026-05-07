export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { services } from '@/lib/schema'
import { asc } from 'drizzle-orm'
import ServicesManager from './ServicesManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Services' }

export default async function AdminServicesPage() {
  const allServices = await db.select().from(services).orderBy(asc(services.sortOrder))
  return (
    <div className="space-y-6 max-w-3xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Manage Services</h1>
        <p className="text-sm text-gray-500 mt-1">Add, edit, or disable services shown on the website.</p>
      </div>
      <ServicesManager initialServices={allServices} />
    </div>
  )
}
