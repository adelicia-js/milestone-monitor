import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
  try {
    // Verify the user is authenticated and has admin privileges
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user's faculty record to check if they're HOD
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('faculty_role')
      .eq('faculty_email', user.email)
      .single();

    if (facultyError || !facultyData || facultyData.faculty_role !== 'hod') {
      return NextResponse.json({ error: 'Forbidden: Only HOD can update staff' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { email, updates } = body;
    
    if (!email || !updates) {
      return NextResponse.json({ error: 'Missing email or updates parameter' }, { status: 400 });
    }

    console.log('SERVER UPDATE: Attempting to update staff with email:', email, 'updates:', updates);

    // Create Supabase admin client (server-side only) to bypass RLS
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // First, let's check if the record exists
    const { data: checkData, error: checkError } = await supabaseAdmin
      .from('faculty')
      .select('*')
      .eq('faculty_email', email);

    console.log('SERVER UPDATE: Check if record exists:', { checkData, checkError });

    if (checkError || !checkData || checkData.length === 0) {
      return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
    }

    // Update faculty record
    const { data, error } = await supabaseAdmin
      .from('faculty')
      .update(updates)
      .eq('faculty_email', email)
      .select();

    console.log('SERVER UPDATE: Faculty record update result:', { data, error });

    if (error) {
      console.error('Server update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const updatedFaculty = data && data.length > 0 ? data[0] : null;
    
    if (!updatedFaculty) {
      return NextResponse.json({ error: 'Failed to update faculty member' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedFaculty });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}