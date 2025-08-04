export * from './client';
export * from './faculty/facultyApi';
export * from './conference/conferenceApi';
export * from './workshop/workshopApi';
export * from './journal/journalApi';
export * from './patent/patentApi';
export * from './report/reportApi';
export * from './upload/uploadApi';
export * from './auth/authApi';
export * from './approval/approvalApi';
export * from './settings/settingsApi';

// API instances
import { ConferenceApi } from './conference/conferenceApi';
import { JournalApi } from './journal/journalApi';  
import { PatentApi } from './patent/patentApi';
import { WorkshopApi } from './workshop/workshopApi';
import { FacultyApi } from './faculty/facultyApi';
import { ApprovalApi } from './approval/approvalApi';
import { SettingsApi } from './settings/settingsApi';

export const conferenceApi = new ConferenceApi();
export const journalApi = new JournalApi();
export const patentApi = new PatentApi();
export const workshopApi = new WorkshopApi();
export const facultyApi = new FacultyApi();
export const approvalApi = new ApprovalApi();
export const settingsApi = new SettingsApi(); 