import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import DynamicList from './DynamicList';

export default function InterestsForm() {
  const { t } = useTranslation();
  const { interests, addInterest, updateInterest, removeInterest, reorderStringList } = useCvStore();

  return (
    <FormSection title={t('sections.interests')}>
      <DynamicList<string>
        items={interests}
        onAdd={addInterest}
        onRemove={(i) => removeInterest(i)}
        itemIds={interests.map((_, i) => `interest-${i}`)}
        onReorder={(f, t) => reorderStringList('interests', f, t)}
        renderItem={(item, i) => (
          <input
            type="text"
            value={item}
            onChange={(e) => updateInterest(i, e.target.value)}
            placeholder={t('fields.interest')}
          />
        )}
      />
    </FormSection>
  );
}
