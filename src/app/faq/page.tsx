import type { Metadata } from 'next'
import FaqClient from './FaqClient'

export const metadata: Metadata = { title: 'FAQ' }

export default function FAQPage() {
  return <FaqClient />
}
