import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import type { SectionTitles } from '../../types/cv';

const TITLE_KEYS: (keyof SectionTitles)[] = [
  'education', 'technicalSkills', 'personalSkills', 'interests',
  'summary', 'workExperience', 'projects', 'certifications',
];

export default function SectionTitlesForm() {
  const { t } = useTranslation();
  const { sectionTitles, updateSectionTitle } = useCvStore();

  return (
    <FormSection title={t('sections.sectionTitles')}>
      {TITLE_KEYS.map((key) => (
        <label key={key} className="field-label">
          {t(`sectionTitles.${key}`)}
          <input
            type="text"
            value={sectionTitles?.[key] || ''}
            onChange={(e) => updateSectionTitle(key, e.target.value)}
          />
        </label>
      ))}
    </FormSection>
  );
}
