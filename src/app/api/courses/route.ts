import { auth } from "@clerk/nextjs/server";
import { NextResponse , NextRequest} from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        authorId: userId,
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return new NextResponse("Error fetching courses", { status: 500 });
  }
}

interface PayloadInterface {
    title: string;
}

export async function POST(request: NextRequest) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title } = await request.json();

        // Check if the user exists in your database
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            // If the user doesn't exist, create them
            await prisma.user.create({
                data: { id: userId }
            });
        }

        // Create new course
        const newCourse = await prisma.course.create({
            data: {
                title, 
                authorId: userId,
                published: false
            }
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error('Failed to create course:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.authorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.course.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
