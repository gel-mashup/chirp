import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateActivityReport } from '@/lib/report'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const format = searchParams.get('format') || 'json'

  if (!userId) {
    return NextResponse.json(
      { message: 'Missing userId parameter' },
      { status: 400 }
    )
  }

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Start and end dates are required' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  })

  if (!user) {
    return NextResponse.json(
      { msg: 'User does not exist', status: 'error' },
      { status: 404 }
    )
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json(
      { error: { message: 'Invalid date format', code: 'INVALID_DATE' } },
      { status: 422 }
    )
  }

  const report = await generateActivityReport(userId, startDate, endDate, format)

  if ('error' in report) {
    return NextResponse.json(
      { failed: true, reason: report.error },
      { status: (report as any).code || 500 }
    )
  }

  return NextResponse.json({
    success: true,
    result: report,
  })
}