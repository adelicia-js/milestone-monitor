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
      .select('faculty_role, faculty_department')
      .eq('faculty_email', user.email)
      .single();

    if (facultyError || !facultyData || facultyData.faculty_role.toLowerCase() !== 'hod') {
      return NextResponse.json({ error: 'Forbidden: Only HOD can reset passwords' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { email, newPassword } = body;
    
    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Missing email or newPassword parameter' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    console.log('SERVER RESET-PASSWORD: Attempting to reset password for:', email);

    // Create Supabase admin client (server-side only) to manage auth users
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

    // First, verify that the target user is in the HOD's department
    const { data: targetFaculty, error: targetError } = await supabaseAdmin
      .from('faculty')
      .select('faculty_department, faculty_name')
      .eq('faculty_email', email)
      .single();

    if (targetError || !targetFaculty) {
      return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
    }

    // Check if the target faculty is in the same department as the HOD
    if (targetFaculty.faculty_department !== facultyData.faculty_department) {
      return NextResponse.json({ 
        error: 'Forbidden: Can only reset passwords for faculty in your department' 
      }, { status: 403 });
    }

    // Find the auth user by email
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return NextResponse.json({ error: 'Failed to access user accounts' }, { status: 500 });
    }

    const authUser = authUsers?.users.find(u => u.email === email);
    
    if (!authUser) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    console.log('SERVER RESET-PASSWORD: Found auth user, updating password for:', authUser.id);

    // Update the user's password
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      authUser.id,
      {
        password: newPassword,
        email_confirm: true // Ensure email remains confirmed after password reset
      }
    );

    if (updateError) {
      console.error('SERVER RESET-PASSWORD: Failed to update password:', updateError);
      return NextResponse.json({ 
        error: `Failed to reset password: ${updateError.message}` 
      }, { status: 500 });
    }

    console.log('SERVER RESET-PASSWORD: Successfully updated password for:', email);

    return NextResponse.json({ 
      data: { 
        success: true, 
        faculty_name: targetFaculty.faculty_name,
        email: email 
      },
      message: `Password successfully reset for ${targetFaculty.faculty_name}`
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}