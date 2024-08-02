import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Ensure this path is correct based on your project structure

export async function GET() {
  try {
    // Count the number of entries with color 'green'
    const greenCount = await prisma.dates.count({
      where: {
        color: 'green',
      },
    });

    // Count the number of entries with color 'red'
    const redCount = await prisma.dates.count({
      where: {
        color: 'red',
      },
    });

    // Return the counts in a JSON response
    return NextResponse.json({ success: true, greenCount, redCount });
  } catch (error) {
    console.error('Error fetching color counts:', error);
    return NextResponse.json({ success: false, error: error });
  }
}
