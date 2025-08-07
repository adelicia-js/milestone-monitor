export interface Faculty {
  faculty_id: string;
  faculty_name: string;
  faculty_department: string;
  faculty_role: string;
  faculty_phone: string | null;
  faculty_email: string;
  faculty_linkedin?: string | null;
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
  patent_link?: string;
  image?: string;
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

// Form data types (without id and is_verified for new entries)
export type ConferenceFormData = Omit<Conference, 'id' | 'is_verified'>;
export type JournalFormData = Omit<Journal, 'id' | 'is_verified'>;
export type WorkshopFormData = Omit<Workshop, 'id' | 'is_verified'>;
export type PatentFormData = Omit<Patent, 'id' | 'is_verified'>;

// Union types for academic entries
export type AcademicEntry = Conference | Journal | Workshop | Patent;
export type AcademicFormData = ConferenceFormData | JournalFormData | WorkshopFormData | PatentFormData;

// Approval system types
export type ApprovalEntry = Record<string, string | number | boolean | null | undefined> & {
  id?: number;
  entry_type: 'Conference' | 'Journal' | 'Workshop' | 'Patent';
  title: string;
  faculty_id: string;
  faculty_name?: string;
  date: string;
  is_verified: 'PENDING' | 'APPROVED' | 'REJECTED';
};

// Staff management types
export interface StaffFormData {
  faculty_name: string;
  faculty_id: string;
  faculty_department: string;
  faculty_role: 'faculty' | 'hod' | 'editor';
  faculty_phone: string | null;
  faculty_email: string;
  password?: string; // Only for creation
}

// Export data types
export type ExportData = Conference[] | Journal[] | Workshop[] | Patent[];
export interface ExportRow {
  [key: string]: string | number | boolean | null | undefined;
}

// Generic component props
export interface BaseComponentProps<T> {
  data: T[];
  loading?: boolean;
  error?: string | null;
}

export interface CrudOperations<T, TForm = Omit<T, 'id'>> {
  onAddNew: (data: TForm) => Promise<void> | void;
  onEdit?: (data: T) => Promise<void> | void;
  onDelete?: (id: string | number) => Promise<void> | void;
}

// Report generation types
export interface ReportEntry {
  title: string;
  faculty_id: string;
  faculty_name?: string;
  entry_type: 'conference' | 'journal' | 'workshop' | 'patent';
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
} 