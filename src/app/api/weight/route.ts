import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Weight from '@/models/Weight';

// GET all weight entries
export async function GET() {
  try {
    await connectToDatabase();
    const weights = await Weight.find().sort({ date: -1 });
    return NextResponse.json(weights);
  } catch (error) {
    console.error('Failed to fetch weight entries:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database. Please check your MongoDB connection.' },
      { status: 500 }
    );
  }
}

// POST a new weight entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weight, date, notes } = body;
    
    if (!weight || !date) {
      return NextResponse.json(
        { error: 'Weight and date are required fields' },
        { status: 400 }
      );
    }
    
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Failed to connect to database. Please check your MongoDB connection.' },
        { status: 500 }
      );
    }
    
    const newWeight = new Weight({
      weight,
      date: new Date(date),
      notes: notes || '',
    });
    
    await newWeight.save();
    
    return NextResponse.json(newWeight, { status: 201 });
  } catch (error) {
    console.error('Error adding weight entry:', error);
    return NextResponse.json(
      { error: 'Failed to add weight entry' },
      { status: 500 }
    );
  }
} 