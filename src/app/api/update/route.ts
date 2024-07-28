import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// Handler for POST requests to update the course percentage
export async function POST(request: Request) {
  try {
    const { id, percentage } = await request.json();

    if (!id || percentage === undefined) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { percentage },
    });

    return NextResponse.json({ success: true, updatedCourse });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update course', error }, { status: 500 });
  }
}
