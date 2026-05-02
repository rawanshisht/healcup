export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { siteContent } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import ContentManager from './ContentManager'
import { DEFAULT_ABOUT, DEFAULT_HOW_IT_WORKS } from './defaults'
import type { AboutContent, HowItWorksContent } from './defaults'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Content' }

async function getContent<T>(key: string, fallback: T): Promise<T> {
  const rows = await db.select().from(siteContent).where(eq(siteContent.key, key))
  return rows.length ? (rows[0].value as T) : fallback
}

export default async function AdminContentPage() {
  const [about, howItWorks] = await Promise.all([
    getContent<AboutContent>('about', DEFAULT_ABOUT),
    getContent<HowItWorksContent>('how_it_works', DEFAULT_HOW_IT_WORKS),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Page Content</h1>
        <p className="text-sm text-gray-500 mt-1">Edit the text shown on the About and How It Works pages.</p>
      </div>
      <ContentManager initialAbout={about} initialHowItWorks={howItWorks} />
    </div>
  )
}
