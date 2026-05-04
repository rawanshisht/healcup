import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Toaster } from '@/components/ui/sonner'
import { db } from '@/lib/db'
import { siteContent } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { DEFAULT_CONTACT_INFO } from '@/app/admin/content/defaults'
import type { ContactInfo } from '@/app/admin/content/defaults'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'

export const metadata: Metadata = {
  title: { default: clinicName, template: `%s | ${clinicName}` },
  description:
    'Professional hijama (cupping therapy) clinic offering wet cupping, dry cupping, and holistic treatments rooted in the Sunnah. Book your appointment online.',
  keywords: ['hijama', 'cupping therapy', 'wet cupping', 'dry cupping', 'sunnah', 'Islamic medicine'],
}

async function getContactInfo(): Promise<ContactInfo> {
  try {
    const rows = await db.select().from(siteContent).where(eq(siteContent.key, 'contact_info'))
    return rows.length ? (rows[0].value as ContactInfo) : DEFAULT_CONTACT_INFO
  } catch {
    return DEFAULT_CONTACT_INFO
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getContactInfo()

  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable}`}>
      <body>
        <Navbar phone={contact.phone} />
        <main>{children}</main>
        <Footer contact={contact} />
        <WhatsAppButton whatsapp={contact.whatsapp} />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
