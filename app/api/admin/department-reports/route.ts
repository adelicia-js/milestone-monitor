import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface BaseEntry {
  faculty_id: string;
  faculty_name: string;
  is_verified: string;
  entry_type?: string;
}

interface EntryData extends BaseEntry {
  paper_title?: string;
  title?: string;
  patent_name?: string;
  conf_date?: string;
  month_and_year_of_publication?: string;
  date?: string;
  patent_date?: string;
}

interface ReportData {
  full_data: EntryData[];
  disp_data: {
    title: string;
    faculty_id: string;
    faculty_name: string;
    entry_type: string;
    date: string;
    status: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated and has editor/HOD privileges
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

    // Get the current user's faculty record to check if they're HOD or Editor
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('faculty_role, faculty_department')
      .eq('faculty_email', user.email)
      .single();

    if (facultyError || !facultyData || 
        !['hod', 'editor'].includes(facultyData.faculty_role.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden: Only HOD and Editor can generate reports' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { 
      startDate = '2001-01-01',
      endDate = new Date().toISOString().split('T')[0],
      filterType = 'all',
      title = '',
      status = 'PENDING',
      facultyId = '',
      department = ''
    } = body;

    // For HODs, restrict to their department; Editors can access all departments
    const targetDepartment = facultyData.faculty_role.toLowerCase() === 'hod' 
      ? facultyData.faculty_department 
      : department;

    if (!targetDepartment) {
      return NextResponse.json({ error: 'Department is required for report generation' }, { status: 400 });
    }

    console.log('SERVER REPORT: Generating report for department:', targetDepartment);

    // Create Supabase admin client (server-side only) to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get all faculty IDs from the department
    const { data: facultyList, error: facultyListError } = await supabaseAdmin
      .from('faculty')
      .select('faculty_id, faculty_name')
      .eq('faculty_department', targetDepartment);

    if (facultyListError) {
      console.error('Error fetching faculty list:', facultyListError);
      return NextResponse.json({ error: 'Failed to fetch faculty list' }, { status: 500 });
    }

    if (!facultyList || facultyList.length === 0) {
      return NextResponse.json({ 
        data: { full_data: [], disp_data: [] },
        error: null 
      });
    }

    const departmentFacultyIds = facultyList.map(f => f.faculty_id);
    const facultyNameMap = Object.fromEntries(facultyList.map(f => [f.faculty_id, f.faculty_name]));

    // Fetch data from all tables using admin client
    const [conferences, journals, workshops, patents] = await Promise.all([
      supabaseAdmin
        .from('conferences')
        .select('*')
        .in('faculty_id', departmentFacultyIds)
        .gte('conf_date', startDate)
        .lte('conf_date', endDate),
      supabaseAdmin
        .from('journal_publications')
        .select('*')
        .in('faculty_id', departmentFacultyIds)
        .gte('month_and_year_of_publication', startDate)
        .lte('month_and_year_of_publication', endDate),
      supabaseAdmin
        .from('fdp_workshop_refresher_course')
        .select('*')
        .in('faculty_id', departmentFacultyIds)
        .gte('date', startDate)
        .lte('date', endDate),
      supabaseAdmin
        .from('patents')
        .select('*')
        .in('faculty_id', departmentFacultyIds)
        .gte('patent_date', startDate)
        .lte('patent_date', endDate)
    ]);

    // Check for errors
    const errors = [conferences.error, journals.error, workshops.error, patents.error].filter(Boolean);
    if (errors.length > 0) {
      console.error('Database errors:', errors);
      return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }

    // Add faculty names and entry types
    const addMetadata = (data: Record<string, unknown>[], entryType: string): EntryData[] => {
      return (data || []).map(item => ({
        ...item,
        faculty_name: facultyNameMap[item.faculty_id as string] || 'Unknown',
        entry_type: entryType
      } as EntryData));
    };

    const enrichedConferences = addMetadata(conferences.data || [], 'conference');
    const enrichedJournals = addMetadata(journals.data || [], 'journal');
    const enrichedWorkshops = addMetadata(workshops.data || [], 'workshop');
    const enrichedPatents = addMetadata(patents.data || [], 'patent');

    // Filter by title, status, and specific faculty
    const filterData = (data: EntryData[]) => {
      return data.filter((item) => {
        const titleMatch = !title || 
          (item.paper_title?.toLowerCase().includes(title.toLowerCase()) ||
           item.title?.toLowerCase().includes(title.toLowerCase()) ||
           item.patent_name?.toLowerCase().includes(title.toLowerCase()));
        const statusMatch = !status || item.is_verified === status;
        const facultyMatch = !facultyId || item.faculty_id === facultyId;
        return titleMatch && statusMatch && facultyMatch;
      });
    };

    const filteredConferences = filterData(enrichedConferences);
    const filteredJournals = filterData(enrichedJournals);
    const filteredWorkshops = filterData(enrichedWorkshops);
    const filteredPatents = filterData(enrichedPatents);

    // Create display data
    const createDisplayData = (data: EntryData[]) => {
      return data.map(item => ({
        title: item.paper_title || item.title || item.patent_name || 'Untitled',
        faculty_id: item.faculty_id,
        faculty_name: item.faculty_name,
        entry_type: item.entry_type || 'unknown',
        date: item.conf_date || item.month_and_year_of_publication || item.date || item.patent_date || 'No date',
        status: item.is_verified,
      }));
    };

    const conferenceDisplayData = createDisplayData(filteredConferences);
    const journalDisplayData = createDisplayData(filteredJournals);
    const workshopDisplayData = createDisplayData(filteredWorkshops);
    const patentDisplayData = createDisplayData(filteredPatents);

    let fullData: EntryData[] = [];
    let displayData: ReportData['disp_data'] = [];

    switch (filterType) {
      case 'Conferences':
        fullData = filteredConferences;
        displayData = conferenceDisplayData;
        break;
      case 'Journals':
        fullData = filteredJournals;
        displayData = journalDisplayData;
        break;
      case 'Workshops':
        fullData = filteredWorkshops;
        displayData = workshopDisplayData;
        break;
      case 'Patents':
        fullData = filteredPatents;
        displayData = patentDisplayData;
        break;
      default:
        fullData = [
          ...filteredConferences,
          ...filteredJournals,
          ...filteredWorkshops,
          ...filteredPatents,
        ];
        displayData = [
          ...conferenceDisplayData,
          ...journalDisplayData,
          ...workshopDisplayData,
          ...patentDisplayData,
        ];
    }

    return NextResponse.json({
      data: {
        full_data: fullData,
        disp_data: displayData,
      },
      error: null
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}