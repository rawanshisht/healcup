import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy & Terms' }

export default function PrivacyPage() {
  return (
    <>
      <section className="pattern-bg relative py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#1a4a4a]/80" />
        <div className="container-site relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Privacy Policy & Terms</h1>
          <p className="text-white/60 text-sm mt-3">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      <section className="py-16 pattern-light">
        <div className="container-site max-w-3xl mx-auto prose prose-sm max-w-none text-gray-700">
          <div className="space-y-8">
            {[
              {
                title: '1. Information We Collect',
                body: 'When you book an appointment, we collect your name, phone number, email address, gender, preferred appointment date and time, and health screening information. This information is necessary to provide our service and ensure your safety.',
              },
              {
                title: '2. How We Use Your Information',
                body: 'Your information is used solely to manage your appointment, send you confirmations and reminders, and ensure we provide you with appropriate and safe care. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
              },
              {
                title: '3. Data Storage & Security',
                body: 'Your data is stored securely on encrypted servers. We retain appointment records for a period of 7 years as required by health-related record-keeping guidelines. You may request deletion of your data at any time by contacting us.',
              },
              {
                title: '4. Your Rights',
                body: 'Under applicable data protection law, you have the right to access, correct, or delete your personal data. You may also object to processing or request a copy of your data. To exercise these rights, please contact us via email or phone.',
              },
              {
                title: '5. Consent & Medical Information',
                body: 'Health information provided during booking is treated as sensitive personal data and processed only for the purpose of determining your suitability for treatment and providing safe care. By completing our booking form, you consent to this processing.',
              },
              {
                title: '6. Terms of Service',
                body: 'By booking an appointment, you confirm that the information you have provided is accurate. You agree to our cancellation policy (24 hours notice required). We reserve the right to refuse treatment if we believe it is not safe or appropriate. Appointment times are indicative and may vary slightly.',
              },
              {
                title: '7. Disclaimer',
                body: 'Hijama (cupping therapy) is a complementary therapy and should not be used as a substitute for medical diagnosis or treatment. If you have a serious medical condition, please consult a qualified medical doctor before undergoing hijama.',
              },
              {
                title: '8. Contact',
                body: `For any questions about this policy or your data, please contact us at ${process.env.NEXT_PUBLIC_CLINIC_EMAIL ?? 'info@yourclinic.com'}.`,
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 className="text-lg font-bold text-[#1a4a4a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>{title}</h2>
                <p className="text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
