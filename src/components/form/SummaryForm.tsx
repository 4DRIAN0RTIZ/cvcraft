import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';

export default function SummaryForm() {
  const { t } = useTranslation();
  const { summary, setField } = useCvStore();

  return (
    <FormSection title={t('sections.summary')}>
      <textarea
        value={summary}
        onChange={(e) => setField('summary', e.target.value)}
        rows={6}
        placeholder={t('fields.summary')}
      />
    </FormSection>
  );
}
