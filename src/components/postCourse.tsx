// src/components/postCourse.ts
"use server"

import prisma from '../../lib/prisma'

export default async function postCourse(formData: FormData) {
  const title = formData.get('title') as string
  const percentage = parseInt(formData.get('percentage') as string)
  const authorId = formData.get('authorId') as string

  if (!title || isNaN(percentage) || !authorId) {
    throw new Error('Invalid input')
  }

  try {
    // Check if the author exists
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId }
    })

    if (!authorExists) {
      throw new Error('Author not found')
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        percentage,
        authorId,
        published: false
      }
    })
    return newCourse
  } catch (error) {
    console.error('Failed to create course:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Failed to create course')
    }
  }
}