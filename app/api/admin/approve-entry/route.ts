import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated and has HOD privileges
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
      return NextResponse.json({ error: 'Forbidden: Only HOD can approve entries' }, { status: 403 });
    }

    // Parse request body
    const { entry_type, id, action } = await request.json();
    
    if (!entry_type || !id || !action) {
      return NextResponse.json({ error: 'Missing required fields: entry_type, id, action' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
    }

    console.log('SERVER APPROVAL: Processing', { entry_type, id, action });

    // Map entry type to table name
    let tableName: string;
    switch (entry_type) {
      case 'Conference':
        tableName = 'conferences';
        break;
      case 'Journal':
        tableName = 'journal_publications';
        break;
      case 'Workshop':
        tableName = 'fdp_workshop_refresher_course';
        break;
      case 'Patent':
        tableName = 'patents';
        break;
      default:
        return NextResponse.json({ error: `Unknown entry type: ${entry_type}` }, { status: 400 });
    }

    // Create Supabase admin client to bypass RLS
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

    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    // Update the entry status using admin client
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .update({ is_verified: newStatus })
      .eq('id', id)
      .select();

    console.log('SERVER APPROVAL: Update result:', { data, error });

    if (error) {
      console.error('Server approval error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const updatedEntry = data && data.length > 0 ? data[0] : null;
    
    if (!updatedEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      data: updatedEntry,
      message: `Entry ${action}d successfully`
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}