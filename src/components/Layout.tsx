import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CvPreview from '../cv-template/CvPreview';
import HeaderForm from './form/HeaderForm';
import ContactForm from './form/ContactForm';
import SummaryForm from './form/SummaryForm';
import EducationForm from './form/EducationForm';
import SkillsForm from './form/SkillsForm';
import InterestsForm from './form/InterestsForm';
import WorkExperienceForm from './form/WorkExperienceForm';
import ProjectsForm from './form/ProjectsForm';
import CertificationsForm from './form/CertificationsForm';
import SectionTitlesForm from './form/SectionTitlesForm';
import ColorForm from './form/ColorForm';

export default function Layout() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="layout">
      <div className={`form-panel ${activeTab === 'edit' ? 'mobile-visible' : 'mobile-hidden'}`}>
        <div className="form-scroll">
          <HeaderForm />
          <ContactForm />
          <SummaryForm />
          <EducationForm />
          <SkillsForm type="technicalSkills" />
          <SkillsForm type="personalSkills" />
          <InterestsForm />
          <WorkExperienceForm />
          <ProjectsForm />
          <CertificationsForm />
          <SectionTitlesForm />
          <ColorForm />
        </div>
      </div>
      <div className={`preview-panel ${activeTab === 'preview' ? 'mobile-visible' : 'mobile-hidden'}`}>
        <CvPreview />
      </div>

      {/* Mobile tab bar at bottom */}
      <div className="mobile-tabs">
        <button
          type="button"
          className={`mobile-tab ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          {t('tabs.edit')}
        </button>
        <button
          type="button"
          className={`mobile-tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          {t('tabs.preview')}
        </button>
      </div>
    </div>
  );
}
