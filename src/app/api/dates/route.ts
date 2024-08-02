import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Assuming you're using Prisma ORM and have a configured instance

export async function GET() {
  try {
    const dates = await prisma.dates.findMany();
    return NextResponse.json(dates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dates' });
  }
}
