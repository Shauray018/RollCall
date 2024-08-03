import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const courses = await prisma.course.findMany();
        return NextResponse.json(courses);
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        return NextResponse.json({ error: "I can't fetch courses for some reason" }, { status: 500 });
    }
}

interface PayloadInterface {
    title: string;// Make percentage optional if not always required
    authorId: string;
}

export async function POST(request: NextRequest) {
    try {
        const data: PayloadInterface = await request.json();
        const { title, authorId } = data; // Default percentage to 0 if not provided

        // Check if the author exists
        const authorExists = await prisma.user.findUnique({
            where: { id: authorId }
        });

        if (!authorExists) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

        // Create new course
        const newCourse = await prisma.course.create({
            data: {
                title, 
                authorId,
                published: false
            }
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error('Failed to create course:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
