import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CvData, ContactItem, EducationEntry, JobEntry, ProjectEntry, CertItem, SectionTitles, ColorScheme } from '../types/cv';
import { defaultData, DEFAULT_SECTION_TITLES, DEFAULT_COLOR_SCHEME } from '../utils/defaultData';
import { nanoid } from 'nanoid';

const id = () => nanoid(8);

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

// Extract only CvData keys from the store (excludes actions)
const CV_DATA_KEYS: (keyof CvData)[] = [
  'fullName', 'professionalTitle', 'photoUrl', 'photoSize',
  'contactItems', 'education', 'technicalSkills', 'personalSkills',
  'interests', 'summary', 'workExperience', 'projects', 'certifications',
  'sectionTitles', 'colorScheme', 'dateFormat',
];

export function extractCvData(store: CvStore): CvData {
  const data = {} as Record<string, unknown>;
  for (const key of CV_DATA_KEYS) {
    data[key] = store[key];
  }
  return data as unknown as CvData;
}

interface CvStore extends CvData {
  // Setters
  setField: <K extends keyof CvData>(key: K, value: CvData[K]) => void;
  setData: (data: CvData) => void;
  resetData: () => void;

  // Section titles
  updateSectionTitle: (key: keyof SectionTitles, value: string) => void;

  // Color scheme
  updateColorScheme: (key: keyof ColorScheme, value: string) => void;

  // Reorder for arrays with id
  reorderList: (key: 'contactItems' | 'education' | 'workExperience' | 'projects' | 'certifications', fromIndex: number, toIndex: number) => void;

  // Reorder for string arrays
  reorderStringList: (key: 'technicalSkills' | 'personalSkills' | 'interests', fromIndex: number, toIndex: number) => void;

  // Reorder nested arrays
  reorderAchievements: (jobId: string, from: number, to: number) => void;
  reorderProjectDetails: (projectId: string, from: number, to: number) => void;
  reorderCertItems: (categoryId: string, from: number, to: number) => void;

  // Contact
  addContact: () => void;
  updateContact: (id: string, patch: Partial<ContactItem>) => void;
  removeContact: (id: string) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (type: 'technicalSkills' | 'personalSkills') => void;
  updateSkill: (type: 'technicalSkills' | 'personalSkills', index: number, value: string) => void;
  removeSkill: (type: 'technicalSkills' | 'personalSkills', index: number) => void;

  // Interests
  addInterest: () => void;
  updateInterest: (index: number, value: string) => void;
  removeInterest: (index: number) => void;

  // Work experience
  addJob: () => void;
  updateJob: (id: string, patch: Partial<Omit<JobEntry, 'id' | 'achievements'>>) => void;
  removeJob: (id: string) => void;
  addAchievement: (jobId: string) => void;
  updateAchievement: (jobId: string, index: number, value: string) => void;
  removeAchievement: (jobId: string, index: number) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, patch: Partial<Omit<ProjectEntry, 'id' | 'details'>>) => void;
  removeProject: (id: string) => void;
  addProjectDetail: (projectId: string) => void;
  updateProjectDetail: (projectId: string, index: number, value: string) => void;
  removeProjectDetail: (projectId: string, index: number) => void;

  // Certifications
  addCertCategory: () => void;
  updateCertCategory: (id: string, title: string) => void;
  removeCertCategory: (id: string) => void;
  addCertItem: (categoryId: string) => void;
  updateCertItem: (categoryId: string, itemId: string, patch: Partial<CertItem>) => void;
  removeCertItem: (categoryId: string, itemId: string) => void;
}

export type { CvStore };

export const useCvStore = create<CvStore>()(
  persist(
    (set) => ({
      ...defaultData,

      setField: (key, value) => set({ [key]: value }),
      setData: (data) => set(data),
      resetData: () => set(defaultData),

      // Section titles
      updateSectionTitle: (key, value) => set((s) => ({
        sectionTitles: { ...s.sectionTitles, [key]: value },
      })),

      // Color scheme
      updateColorScheme: (key, value) => set((s) => ({
        colorScheme: { ...s.colorScheme, [key]: value },
      })),

      // Reorder lists with id
      reorderList: (key, fromIndex, toIndex) => set((s) => ({
        [key]: arrayMove(s[key] as unknown[], fromIndex, toIndex),
      })),

      // Reorder string arrays
      reorderStringList: (key, fromIndex, toIndex) => set((s) => ({
        [key]: arrayMove(s[key], fromIndex, toIndex),
      })),

      // Reorder nested arrays
      reorderAchievements: (jid, from, to) => set((s) => ({
        workExperience: s.workExperience.map((j) =>
          j.id === jid ? { ...j, achievements: arrayMove(j.achievements, from, to) } : j
        ),
      })),
      reorderProjectDetails: (pid, from, to) => set((s) => ({
        projects: s.projects.map((p) =>
          p.id === pid ? { ...p, details: arrayMove(p.details, from, to) } : p
        ),
      })),
      reorderCertItems: (cid, from, to) => set((s) => ({
        certifications: s.certifications.map((c) =>
          c.id === cid ? { ...c, items: arrayMove(c.items, from, to) } : c
        ),
      })),

      // Contact
      addContact: () => set((s) => ({
        contactItems: [...s.contactItems, { id: id(), icon: 'fas fa-link', text: '' }],
      })),
      updateContact: (cid, patch) => set((s) => ({
        contactItems: s.contactItems.map((c) => c.id === cid ? { ...c, ...patch } : c),
      })),
      removeContact: (cid) => set((s) => ({
        contactItems: s.contactItems.filter((c) => c.id !== cid),
      })),

      // Education
      addEducation: () => set((s) => ({
        education: [...s.education, { id: id(), title: '', school: '', date: '' }],
      })),
      updateEducation: (eid, patch) => set((s) => ({
        education: s.education.map((e) => e.id === eid ? { ...e, ...patch } : e),
      })),
      removeEducation: (eid) => set((s) => ({
        education: s.education.filter((e) => e.id !== eid),
      })),

      // Skills
      addSkill: (type) => set((s) => ({ [type]: [...s[type], ''] })),
      updateSkill: (type, index, value) => set((s) => {
        const arr = [...s[type]];
        arr[index] = value;
        return { [type]: arr };
      }),
      removeSkill: (type, index) => set((s) => ({
        [type]: s[type].filter((_, i) => i !== index),
      })),

      // Interests
      addInterest: () => set((s) => ({ interests: [...s.interests, ''] })),
      updateInterest: (index, value) => set((s) => {
        const arr = [...s.interests];
        arr[index] = value;
        return { interests: arr };
      }),
      removeInterest: (index) => set((s) => ({
        interests: s.interests.filter((_, i) => i !== index),
      })),

      // Work experience
      addJob: () => set((s) => ({
        workExperience: [...s.workExperience, { id: id(), title: '', company: '', date: '', achievements: [] }],
      })),
      updateJob: (jid, patch) => set((s) => ({
        workExperience: s.workExperience.map((j) => j.id === jid ? { ...j, ...patch } : j),
      })),
      removeJob: (jid) => set((s) => ({
        workExperience: s.workExperience.filter((j) => j.id !== jid),
      })),
      addAchievement: (jid) => set((s) => ({
        workExperience: s.workExperience.map((j) =>
          j.id === jid ? { ...j, achievements: [...j.achievements, ''] } : j
        ),
      })),
      updateAchievement: (jid, index, value) => set((s) => ({
        workExperience: s.workExperience.map((j) => {
          if (j.id !== jid) return j;
          const arr = [...j.achievements];
          arr[index] = value;
          return { ...j, achievements: arr };
        }),
      })),
      removeAchievement: (jid, index) => set((s) => ({
        workExperience: s.workExperience.map((j) =>
          j.id === jid ? { ...j, achievements: j.achievements.filter((_, i) => i !== index) } : j
        ),
      })),

      // Projects
      addProject: () => set((s) => ({
        projects: [...s.projects, { id: id(), title: '', details: [] }],
      })),
      updateProject: (pid, patch) => set((s) => ({
        projects: s.projects.map((p) => p.id === pid ? { ...p, ...patch } : p),
      })),
      removeProject: (pid) => set((s) => ({
        projects: s.projects.filter((p) => p.id !== pid),
      })),
      addProjectDetail: (pid) => set((s) => ({
        projects: s.projects.map((p) =>
          p.id === pid ? { ...p, details: [...p.details, ''] } : p
        ),
      })),
      updateProjectDetail: (pid, index, value) => set((s) => ({
        projects: s.projects.map((p) => {
          if (p.id !== pid) return p;
          const arr = [...p.details];
          arr[index] = value;
          return { ...p, details: arr };
        }),
      })),
      removeProjectDetail: (pid, index) => set((s) => ({
        projects: s.projects.map((p) =>
          p.id === pid ? { ...p, details: p.details.filter((_, i) => i !== index) } : p
        ),
      })),

      // Certifications
      addCertCategory: () => set((s) => ({
        certifications: [...s.certifications, { id: id(), title: '', items: [] }],
      })),
      updateCertCategory: (cid, title) => set((s) => ({
        certifications: s.certifications.map((c) => c.id === cid ? { ...c, title } : c),
      })),
      removeCertCategory: (cid) => set((s) => ({
        certifications: s.certifications.filter((c) => c.id !== cid),
      })),
      addCertItem: (cid) => set((s) => ({
        certifications: s.certifications.map((c) =>
          c.id === cid ? { ...c, items: [...c.items, { id: id(), name: '', year: '' }] } : c
        ),
      })),
      updateCertItem: (cid, iid, patch) => set((s) => ({
        certifications: s.certifications.map((c) =>
          c.id === cid ? { ...c, items: c.items.map((i) => i.id === iid ? { ...i, ...patch } : i) } : c
        ),
      })),
      removeCertItem: (cid, iid) => set((s) => ({
        certifications: s.certifications.map((c) =>
          c.id === cid ? { ...c, items: c.items.filter((i) => i.id !== iid) } : c
        ),
      })),
    }),
    {
      name: 'cv-builder-data',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          // Fill missing fields for existing stored data
          if (!state.photoSize) state.photoSize = 160;
          if (!state.sectionTitles) state.sectionTitles = { ...DEFAULT_SECTION_TITLES };
          if (!state.colorScheme) state.colorScheme = { ...DEFAULT_COLOR_SCHEME };
          if (!state.dateFormat) state.dateFormat = 'raw';
        }
        return state as unknown as CvStore;
      },
    }
  )
);
