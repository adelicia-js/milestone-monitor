export interface Faculty {
  faculty_id: string;
  faculty_name: string;
  faculty_department: string;
  faculty_role: string;
  faculty_phone: string | null;
  faculty_email: string;
  faculty_google_scholar?: string | null;
}

export interface Conference {
  id?: number;
  faculty_id: string;
  paper_title: string;
  conf_name: string;
  conf_date: string;
  type: string;
  proceedings: boolean;
  proceeding_fp?: string;
  certificate?: string;
  is_verified: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Journal {
  id?: number;
  faculty_id: string;
  paper_title: string;
  journal_name: string;
  month_and_year_of_publication: string;
  issn_number: string;
  indexed_in: string;
  link?: string;
  upload_image?: string;
  is_verified: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Workshop {
  id?: number;
  faculty_id: string;
  title: string;
  date: string;
  type: string;
  number_of_days: number;
  organized_by: string;
  is_verified: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Patent {
  id?: number;
  faculty_id: string;
  patent_name: string;
  patent_date: string;
  patent_type: string;
  status: string;
  application_no: string;
  is_verified: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface QueryFilters {
  start_date?: string;
  end_date?: string;
  type?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  title?: string;
  faculty_id?: string;
} 