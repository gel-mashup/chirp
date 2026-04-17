import { cookies } from 'next/headers'

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  if (!session?.value) {
    return null
  }

  try {
    const data = JSON.parse(session.value)
    return data.userId || null
  } catch {
    return null
  }
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify({ userId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}