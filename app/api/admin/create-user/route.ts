import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Forbidden: Only HOD can create staff' }, { status: 403 });
    }

    // Parse request body
    const staffData = await request.json();
    
    // Validate required fields
    if (!staffData.faculty_email || !staffData.password || !staffData.faculty_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create Supabase admin client (server-side only)
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

    // Create the auth user
    const { data: authUser, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
      email: staffData.faculty_email,
      password: staffData.password,
      email_confirm: true,
    });

    if (authError2) {
      console.error('Auth user creation error:', authError2);
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Create faculty record using the admin client to bypass RLS
    const { data: facultyRecord, error: facultyInsertError } = await supabaseAdmin
      .from('faculty')
      .insert({
        faculty_id: staffData.faculty_id, // Use the custom faculty ID passed from the form
        faculty_name: staffData.faculty_name,
        faculty_department: staffData.faculty_department,
        faculty_role: staffData.faculty_role,
        faculty_phone: staffData.faculty_phone,
        faculty_email: staffData.faculty_email,
      })
      .select()
      .single();

    if (facultyInsertError) {
      console.error('Faculty record creation error:', facultyInsertError);
      
      // Clean up the auth user if faculty record creation failed
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return NextResponse.json({ error: 'Failed to create faculty record' }, { status: 500 });
    }

    return NextResponse.json({ data: facultyRecord });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}