"use server"

import prisma from '../../lib/prisma' // Adjust the import path as needed

export default async function getCourses() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })
        return courses
    } catch (error) {
        console.error('Failed to fetch courses:', error)
        throw new Error('Failed to fetch courses')
    }
}