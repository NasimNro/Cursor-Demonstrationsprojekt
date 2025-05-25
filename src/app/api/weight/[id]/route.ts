import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Weight from '@/models/Weight';

// GET a specific weight entry
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Failed to connect to database. Please check your MongoDB connection.' },
        { status: 500 }
      );
    }
    
    const weight = await Weight.findById(params.id);
    
    if (!weight) {
      return NextResponse.json(
        { error: 'Weight entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(weight);
  } catch (error) {
    console.error('Failed to fetch weight entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weight entry' },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a weight entry
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
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
    
    const updatedWeight = await Weight.findByIdAndUpdate(
      params.id,
      {
        weight,
        date: new Date(date),
        notes: notes || '',
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedWeight) {
      return NextResponse.json(
        { error: 'Weight entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedWeight);
  } catch (error) {
    console.error('Failed to update weight entry:', error);
    return NextResponse.json(
      { error: 'Failed to update weight entry' },
      { status: 500 }
    );
  }
}

// DELETE a weight entry
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Failed to connect to database. Please check your MongoDB connection.' },
        { status: 500 }
      );
    }
    
    const deletedWeight = await Weight.findByIdAndDelete(params.id);
    
    if (!deletedWeight) {
      return NextResponse.json(
        { error: 'Weight entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Weight entry deleted successfully' });
  } catch (error) {
    console.error('Failed to delete weight entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete weight entry' },
      { status: 500 }
    );
  }
} 