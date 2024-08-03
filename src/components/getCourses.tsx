"use server"


import prisma from "../../lib/prisma";

export default async function getCourses(id: string) {
    try {
        const courses = await prisma.course.findMany({
            where: {
                authorId: id,
            },
        });
        return courses;
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        throw new Error('Failed to fetch courses');
    }
}
