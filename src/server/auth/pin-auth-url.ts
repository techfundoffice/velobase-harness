import { pinOfficeAuthUrl } from '@/lib/office-public-url'

// Must be imported before NextAuth() so OAuth redirect_uri uses aioffice,
// not the Railway Host header / NEXTAUTH_URL.
pinOfficeAuthUrl()
