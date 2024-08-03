import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { date, month, year, color, courseId } = await request.json();

    // Validate input data
    if (typeof date !== 'number' || typeof month !== 'number' || typeof year !== 'number' || typeof color !== 'string' || typeof courseId !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid input data' }, { status: 400 });
    }

    // Check if the date entry already exists in the database
    let dateEntry = await prisma.dates.findFirst({
      where: {
        date,
        month,
        year,
        courseId,
      },
    });

    if (dateEntry) {
      // Update the existing entry
      dateEntry = await prisma.dates.update({
        where: { id: dateEntry.id },
        data: { color },
      });
    } else {
      // Create a new entry if it doesn't exist
      dateEntry = await prisma.dates.create({
        data: { date, month, year, color, courseId },
      });
    }

    return NextResponse.json({ success: true, data: dateEntry });
  } catch (err) {
    console.error('Error updating date color:', err);
    return NextResponse.json({ success: false, error: 'Failed to update date color' }, { status: 500 });
  }
}


// export async function DELETE(request: Request) {
//   const { date, month, year, color, courseId } = await request.json();
//   let dateEntry = await prisma.dates.findFirst({
//     where: {
//       date,
//       month,
//       year,
//     },
//   });

//   await prisma.dates.delete({ 
//     where: { id: dateEntry?.id }
//   })

// }
// const deleteUser = await prisma.user.delete({
//   where: {
//     email: 'bert@prisma.io',
//   },
// })