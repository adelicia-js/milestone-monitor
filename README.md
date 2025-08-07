# Milestone Monitor

A web application for faculty members to track and manage their academic achievements including conferences, journals, patents, and workshops.

## 🌐 Accessing the Application

*Live at: [milestone-monitor.vercel.app](https://milestone-monitor.vercel.app)*

### For New Users (Open Sign-up)
1. **Create Account** - Visit the sign-up page to create your free account
2. **Email Verification** - Check your email and verify your account
3. **Profile Setup** - Your faculty profile will be automatically created with default settings
4. **Start Tracking** - Begin adding your academic achievements

### For Existing Users  
1. **Login** - Use your email and password on the login page
2. **Dashboard** - Access your personalized achievement dashboard
3. **Forgot Password?** - Use the password reset option if needed

### User Roles
- **New accounts** start as "Faculty" with basic access
- **Editors** can generate institutional reports  
- **HODs** have full administrative privileges including staff management and approvals

## 📋 Features

### For Faculty Members
- *Dashboard* - View your profile and track your achievements at a glance
- *Manage Publications* - Add and edit your conferences, journals, patents, and workshops
- *Document Upload* - Attach supporting documents for each achievement
- *Track Status* - See which submissions are pending, approved, or rejected

### For Editors
- *Generate Reports* - Export data as CSV files for analysis
- *View All Records* - Access all faculty submissions across departments
- *Advanced Filtering* - Search by date, type, status, or faculty member

### For HODs (Heads of Department)
- *Approval System* - Review and approve/reject faculty submissions
- *Staff Management* - Add new faculty members to the system
- *Full Admin Access* - Complete control over all features

## 🏗️ Architecture Overview

### Database Design
The application uses **Supabase (PostgreSQL)** with **Row Level Security (RLS)** for secure, role-based data access. Main entities include:
- **Faculty profiles** with authentication and role management
- **Academic achievements** (conferences, journals, patents, workshops)
- **Verification workflows** with approval status tracking
- **Document attachments** with secure file storage

### Authentication & Authorization
- **Supabase Auth** with email/password authentication
- **Cookie-based sessions** for secure client-side state
- **Three-tier role system**: Faculty → Editor → HOD
- **Route protection** via middleware and layout-level checks

### API Architecture
- **Centralized API layer** in `lib/api/` with consistent error handling
- **Type-safe operations** using TypeScript interfaces
- **Custom React hooks** for data fetching and state management
- **Server actions** for secure database operations

### Styling Architecture
- **Styled-components** as the primary styling system with comprehensive design components
- **Centralized design system** via `components/ui/GenericStyles.ts`
- **Responsive design** with media queries built into styled components
- **Google Fonts integration** (Inter font family) for consistent typography
- **Limited Tailwind CSS** usage in authentication pages and simple utilities

### Recent Improvements
- **Mobile responsiveness** with adaptive UI components and laptop optimization
- **Enhanced user experience** with improved navigation and card-based layouts  
- **Robust error handling** and deployment optimizations
- **Type safety improvements** across the entire codebase
- **Advanced export functionality** with multiple format options (CSV, Excel, PDF)

## 🔑 User Roles

1. **Faculty** - Submit and manage their academic achievements
2. **Editor** - Generate reports and view all institutional data  
3. **HOD** - Full administrative access including approvals and staff management

## 📁 Project Structure
```
milestone-monitor/
├── app/                    # Next.js App Router pages
│   ├── (categories)/       # Academic achievement pages (conferences, journals, patents, workshops)
│   ├── (generic)/          # Dashboard homepage
│   ├── (login)/           # Authentication pages (login, sign-up)
│   ├── (modify)/          # Admin features (approvals, staff management)
│   ├── (report-gen)/      # Report generation and export
│   ├── (settings)/        # User settings and profile management
│   ├── api/               # Server functions and database operations
│   └── auth/              # Authentication callbacks
├── components/            # Reusable UI components organized by feature
│   ├── approvals/         # Approval system components
│   ├── categories/        # Achievement category components
│   ├── dashboard/         # Dashboard-specific components
│   ├── navigation/        # Navigation and header components
│   ├── reports/           # Report generation components
│   ├── settings/          # Settings page components
│   ├── staff/             # Staff management components
│   └── ui/                # Generic UI components
├── lib/                   # API layer, hooks, types, and utilities
│   ├── api/              # Type-safe API functions for each entity
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript interfaces
├── public/                # Static files (images, etc.)
└── supabase/             # Database migrations and schema
```

## 🛠 Common Tasks

### Adding a New Achievement
1. Navigate to the relevant section (Conferences, Journals, Patents, or Workshops)
2. Click "Add New"
3. Fill in the required information
4. Upload supporting documents if needed
5. Submit for approval

### Generating Reports
1. Go to the Reports section (Editor/HOD only)
2. Apply filters as needed (date range, faculty, entry type, status)
3. Click the "Export" button to access 3 export formats:
   - **CSV File**: Comma-separated values for spreadsheet applications
   - **Excel Workbook**: Microsoft Excel format with formatting and auto-sized columns
   - **PDF Report**: Formatted document with professional layout for printing
4. Customize export options (include headers, select columns)
5. Download your customized report

### Approving Submissions (HOD only)
1. Navigate to Approvals section
2. Review pending submissions
3. Click Approve or Reject for each item

## 🐛 Troubleshooting

### "Permission denied" errors
- Verify your user role has the necessary permissions
- Contact your HOD if you need elevated access

### Profile picture not showing
- Supported formats: JPG, JPEG, PNG, WEBP
- Maximum file size: 5MB
- Try re-uploading in a different format

### Login issues
- **New users**: Use the sign-up page to create your account first
- **Existing users**: Verify your email and password are correct
- **Email verification**: Check your inbox for the verification email after signing up
- **Password reset**: Use the password reset option if you've forgotten your password
- **Account activation**: Your faculty profile is created automatically upon first login

## 🛠️ Development

### Prerequisites
- **Node.js**: Version 22.0.0 or higher
- **npm**: Latest version
- **Supabase account**: For database and authentication

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Build and preview production
npm run preview

# Run linting
npx eslint .

# Type checking
npx tsc --noEmit
```

### Environment Setup
Create a `.env.local` file with your Supabase configuration:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Development Guidelines
- **Type Safety**: Use TypeScript interfaces from `lib/types/`
- **Component Organization**: Feature-based organization in `components/`
- **API Layer**: Use functions from `lib/api/` instead of direct Supabase calls
- **Authentication**: Use `useAuth()` and `useGetUser()` hooks
- **Styling**: Use styled-components for new components; refer to `GenericStyles.ts` for consistent design patterns
- **Responsive Design**: Implement mobile-first responsive design with media queries in styled components
- **Error Handling**: Implement proper error boundaries and loading states

## 📞 Support

- **Users**: Contact your department's HOD or administrator
- **Technical Issues**: Create an issue via GitHub Issues
- **Feature Requests**: Submit through your HOD

## 💻 Tech Stack

- **Frontend**: Next.js 15.3.3 with App Router, React 18.3.1, TypeScript 5.7.2
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth with cookie-based sessions
- **Styling**: Styled-components 6.1.19 (primary), Tailwind CSS 3.4.16 (limited usage)
- **Charts**: Chart.js 4.4.0 with react-chartjs-2 5.2.0
- **State Management**: React hooks with custom API layer
- **PDF Generation**: jsPDF with autotable for reports
- **File Processing**: XLSX for spreadsheet exports
- **UI Components**: Radix UI, Lucide React icons
- **Development**: ESLint, TypeScript strict mode
- **Hosting**: Vercel
- **Node Version**: >=22.0.0

---

## 📄 License & Credits

**Milestone Monitor** - Academic Achievement Tracking System

Built with ❤️ for academic institutions by Supastrssd

© 2023-2025 - Last updated: August 2025