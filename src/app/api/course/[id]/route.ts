import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust path as needed
import { ACTION_SUFFIX } from 'next/dist/lib/constants';
import { daysToWeeks } from 'date-fns';
import { error } from 'console';

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const { id } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (course) {
      return NextResponse.json(course);
    } else {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching course:', error); // Log the actual error for debugging
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
      // Parse the JSON body from the request
      const data = await request.json();

      if (typeof data.percentage !== 'number' || isNaN(data.percentage)) {
          console.error("Invalid percentage value");
          return NextResponse.json({ error: "Invalid percentage value" }, { status: 400 });
      }

       await prisma.course.update({
          where: { id: Number(id) },
          data: { 
              percentage: data.percentage
          }
      });

      console.log("Percentage updated successfully");
      return NextResponse.json({ message: "Percentage updated successfully" }, { status: 200 });

  } catch (e) {
      console.error("Failed to update percentage:", e);
      return NextResponse.json({ error: "Failed to update percentage" }, { status: 500 });
  }
}


