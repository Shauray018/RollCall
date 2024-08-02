import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';// Ensure prisma is correctly imported

export async function POST(request: Request) {
  try {
    const { date, month, year, color } = await request.json();

    if (typeof date !== 'number' || typeof month !== 'number' || typeof year !== 'number' || typeof color !== 'string') {
      throw new Error('Invalid input data');
    }

    // Check if the date entry already exists in the database
    let dateEntry = await prisma.dates.findFirst({
      where: {
        date,
        month,
        year,
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
        data: { date, month, year, color },
      });
    }

    return NextResponse.json({ success: true, data: dateEntry });
  } catch (err) {
    console.error('Error updating date color:', err);
    return NextResponse.json({ success: false, error: err });
  }
}
