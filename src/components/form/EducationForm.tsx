import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import DynamicList from './DynamicList';
import DateRangeInput from './DateRangeInput';
import type { EducationEntry } from '../../types/cv';

export default function EducationForm() {
  const { t } = useTranslation();
  const { education, dateFormat, addEducation, updateEducation, removeEducation, reorderList } = useCvStore();

  return (
    <FormSection title={t('sections.education')}>
      <DynamicList<EducationEntry>
        items={education}
        onAdd={addEducation}
        onRemove={(i) => removeEducation(education[i].id)}
        itemIds={education.map((e) => e.id)}
        onReorder={(f, t) => reorderList('education', f, t)}
        renderItem={(item) => (
          <div className="field-group">
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateEducation(item.id, { title: e.target.value })}
              placeholder={t('fields.title')}
            />
            <input
              type="text"
              value={item.school}
              onChange={(e) => updateEducation(item.id, { school: e.target.value })}
              placeholder={t('fields.school')}
            />
            <DateRangeInput
              dateFormat={dateFormat}
              rawValue={item.date}
              onRawChange={(v) => updateEducation(item.id, { date: v })}
              startMonth={item.graduationMonth}
              startYear={item.graduationYear}
              onStartMonthChange={(m) => updateEducation(item.id, { graduationMonth: m })}
              onStartYearChange={(y) => updateEducation(item.id, { graduationYear: y })}
              singleDate
            />
          </div>
        )}
      />
    </FormSection>
  );
}
