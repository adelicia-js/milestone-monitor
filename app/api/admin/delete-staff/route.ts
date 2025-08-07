import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
  try {
    // Verify the user is authenticated and has admin privileges
    const supabase = createServerComponentClient({ cookies });
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
      return NextResponse.json({ error: 'Forbidden: Only HOD can delete staff' }, { status: 403 });
    }

    // Get faculty_id from URL params
    const url = new URL(request.url);
    const facultyId = url.searchParams.get('faculty_id');
    
    if (!facultyId) {
      return NextResponse.json({ error: 'Missing faculty_id parameter' }, { status: 400 });
    }

    console.log('SERVER DELETE: Attempting to delete faculty_id:', facultyId);

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
      .eq('faculty_id', facultyId);

    console.log('SERVER DELETE: Check if record exists:', { checkData, checkError });

    // Delete faculty record first
    const { data, error } = await supabaseAdmin
      .from('faculty')
      .delete()
      .eq('faculty_id', facultyId)
      .select();

    console.log('SERVER DELETE: Faculty record delete result:', { data, error });

    if (error) {
      console.error('Server delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const deletedFaculty = data && data.length > 0 ? data[0] : null;
    
    if (!deletedFaculty) {
      return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
    }

    // Now delete the auth user using the faculty email
    if (deletedFaculty.faculty_email) {
      console.log('SERVER DELETE: Attempting to delete auth user for email:', deletedFaculty.faculty_email);
      
      // First find the auth user by email
      const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!listError && authUsers?.users) {
        const authUser = authUsers.users.find(u => u.email === deletedFaculty.faculty_email);
        
        if (authUser) {
          console.log('SERVER DELETE: Found auth user, deleting:', authUser.id);
          const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);
          
          if (deleteAuthError) {
            console.error('SERVER DELETE: Failed to delete auth user:', deleteAuthError);
            // Don't fail the whole operation if auth delete fails
          } else {
            console.log('SERVER DELETE: Successfully deleted auth user');
          }
        } else {
          console.log('SERVER DELETE: No auth user found for email:', deletedFaculty.faculty_email);
        }
      }
    }

    return NextResponse.json({ data: deletedFaculty });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}