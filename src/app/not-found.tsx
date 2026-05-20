import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="pattern-light min-h-[70vh] flex items-center justify-center py-20">
      <div className="container-site text-center max-w-lg mx-auto px-6">

        <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mb-4">404 — Page Not Found</p>

        <h1
          className="text-5xl sm:text-6xl font-bold text-[#1a4a4a] mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Lost?
        </h1>

        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
        </div>

        <p className="text-gray-500 text-base leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist. It may have been moved or the link might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#1a4a4a] hover:bg-[#1e5c5c] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/book"
            className="bg-[#c9a84c] hover:bg-[#b8892a] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm"
          >
            Book an Appointment
          </Link>
        </div>

      </div>
    </section>
  )
}
