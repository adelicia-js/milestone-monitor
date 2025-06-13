# Milestone Monitor

A web application for faculty members to track and manage their academic achievements including conferences, journals, patents, and workshops.

## 🌐 Accessing the Application

*Live at: [milestone-monitor.vercel.app](https://milestone-monitor.vercel.app)*

1. *Login* - Use your institutional email and password
2. *First-time users* - Contact your HOD to get your account created
3. *Forgot password?* - Use the password reset option on the login page

> *Note*: This is a private organizational application. Only authorized faculty and staff have access.

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

## 🔑 User Roles

1. *Faculty* - Regular users who submit their achievements
2. *Editor* - Can generate reports and view all data
3. *HOD* - Full admin access including approvals and staff management

## 📁 Project Structure
```
milestone-monitor/
├── app/                   # Next.js app directory
│   ├── (categories)/      # Pages for conferences, journals, etc.
│   ├── (generic)/         # Dashboard page
│   ├── (login)/          # Authentication
│   ├── (modify)/         # Admin features
│   ├── (report-gen)/     # Report generation
│   └── api/              # Server functions
├── components/           # Reusable UI components
├── public/              # Static files (images, etc.)
└── supabase/           # Database migrations
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
2. Apply filters as needed
3. Click "Download Light Report" for summary data
4. Click "Download Full Report" for complete data

### Approving Submissions (HOD only)
1. Navigate to Approvals section
2. Review pending submissions
3. Click Approve or Reject for each item

## 🐛 Troubleshooting

### "Permission denied" errors
- Verify your user role has the necessary permissions
- Contact your HOD if you need elevated access

### Profile picture not showing
- Supported formats: JPG, JPEG, PNG, WEBP, GIF, BMP, SVG
- Maximum file size: 5MB
- Try re-uploading in a different format

### Login issues
- Ensure you're using your institutional email
- Check with your HOD that your account has been created
- Try the password reset option if you've forgotten your password

## 📞 Support

- *Users*: Contact your department's HOD or administrator
- *Technical Issues*: Email IT support with screenshot of the error
- *Feature Requests*: Submit through your HOD

## 💻 Tech Stack

- *Frontend*: Next.js, React, TypeScript
- *Database*: Supabase (PostgreSQL)
- *Styling*: Tailwind CSS
- *Authentication*: Supabase Auth
- *Hosting*: Vercel

---

Built with ❤ by Supastrssd 2023