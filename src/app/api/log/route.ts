import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level, message, details } = body;

    if (level === 'error') {
      logger.error(message, details);
    } else if (level === 'warn') {
      logger.warn(message, details);
    } else {
      logger.info(message, details);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    logger.error('Failed to parse client log payload', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
