import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all records from the recipes table
    console.log('fetching templates');
    console.log('supabase:', supabase);
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: true })
      .throwOnError(); // This will throw an error if there's an issue

    console.log('templates:', data);

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    console.log('templates:', data);

    // Return the templates data
    return NextResponse.json({ templates: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}