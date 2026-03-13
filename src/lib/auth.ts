import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[auth] authorize called, username:', credentials?.username)
        console.log('[auth] env ADMIN_USERNAME set:', !!process.env.ADMIN_USERNAME)
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          console.log('[auth] credentials match — returning user')
          return { id: '1', name: 'Admin', email: 'admin@clinic.local' }
        }
        console.log('[auth] credentials mismatch')
        return null
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
})
