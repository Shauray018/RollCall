import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';// Adjust path as needed

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
    });
    if (course) {
      return NextResponse.json(course);
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
