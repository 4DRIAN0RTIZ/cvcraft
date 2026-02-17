import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import DynamicList from './DynamicList';

interface Props {
  type: 'technicalSkills' | 'personalSkills';
}

export default function SkillsForm({ type }: Props) {
  const { t } = useTranslation();
  const skills = useCvStore((s) => s[type]);
  const { addSkill, updateSkill, removeSkill, reorderStringList } = useCvStore();

  const sectionKey = type === 'technicalSkills' ? 'sections.technicalSkills' : 'sections.personalSkills';

  return (
    <FormSection title={t(sectionKey)}>
      <DynamicList<string>
        items={skills}
        onAdd={() => addSkill(type)}
        onRemove={(i) => removeSkill(type, i)}
        itemIds={skills.map((_, i) => `${type}-${i}`)}
        onReorder={(f, t) => reorderStringList(type, f, t)}
        renderItem={(item, i) => (
          <input
            type="text"
            value={item}
            onChange={(e) => updateSkill(type, i, e.target.value)}
            placeholder={t('fields.skill')}
          />
        )}
      />
    </FormSection>
  );
}
