import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    const dates = await prisma.dates.findMany({
      where: {
        courseId: parseInt(courseId, 10)
      }
    });

    return NextResponse.json({ success: true, dates });
  } catch (error) {
    console.error('Error fetching dates:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dates' }, { status: 500 });
  }
}