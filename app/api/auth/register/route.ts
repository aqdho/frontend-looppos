import { NextResponse } from 'next/server'

const users = new Map<string, { id: string; name: string; email: string; password: string }>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body as { name?: string; email?: string; password?: string }

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (users.has(email)) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    const id = crypto.randomUUID()
    users.set(email, { id, name, email, password })

    return NextResponse.json(
      { message: 'Registration successful', user: { id, name, email } },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Invalid request' },
      { status: 400 }
    )
  }
}
