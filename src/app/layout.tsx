import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Toaster } from '@/components/ui/sonner'

const clinicName = process.env.NEXT_PUBLIC_CLINIC_NAME ?? 'Al-Shifa Hijama Clinic'

export const metadata: Metadata = {
  title: { default: clinicName, template: `%s | ${clinicName}` },
  description:
    'Professional hijama (cupping therapy) clinic offering wet cupping, dry cupping, and holistic treatments rooted in the Sunnah. Book your appointment online.',
  keywords: ['hijama', 'cupping therapy', 'wet cupping', 'dry cupping', 'sunnah', 'Islamic medicine'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
