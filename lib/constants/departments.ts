export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology", 
  "Electronics and Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Biomedical Engineering",
  "Aerospace Engineering",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Management Studies",
  "Other"
] as const;

export type Department = typeof DEPARTMENTS[number];