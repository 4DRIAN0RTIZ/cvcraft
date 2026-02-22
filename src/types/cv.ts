export interface ContactItem {
  id: string;
  icon: string; // FA class e.g. "fas fa-envelope"
  text: string;
}

export interface EducationEntry {
  id: string;
  title: string;
  school: string;
  date: string;
  graduationMonth?: number;
  graduationYear?: number;
}

export interface JobEntry {
  id: string;
  title: string;
  company: string;
  date: string;
  achievements: string[];
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  isCurrent?: boolean;
}

export interface ProjectEntry {
  id: string;
  title: string;
  details: string[];
}

export interface CertItem {
  id: string;
  name: string;
  year: string;
}

export interface CertCategory {
  id: string;
  title: string;
  items: CertItem[];
}

export interface SectionTitles {
  education: string;
  technicalSkills: string;
  personalSkills: string;
  interests: string;
  summary: string;
  workExperience: string;
  projects: string;
  certifications: string;
}

export interface ColorScheme {
  headerBg: string;
  headerText: string;
  sidebarBg: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

export type DateFormat = 'raw' | 'short' | 'long' | 'numeric';

export interface CvData {
  fullName: string;
  professionalTitle: string;
  photoUrl: string;
  photoSize: number;
  contactItems: ContactItem[];
  education: EducationEntry[];
  technicalSkills: string[];
  personalSkills: string[];
  interests: string[];
  summary: string;
  workExperience: JobEntry[];
  projects: ProjectEntry[];
  certifications: CertCategory[];
  sectionTitles: SectionTitles;
  colorScheme: ColorScheme;
  dateFormat: DateFormat;
}
