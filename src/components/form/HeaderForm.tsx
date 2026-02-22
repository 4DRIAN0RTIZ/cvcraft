import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import type { DateFormat } from '../../types/cv';

export default function HeaderForm() {
  const { t } = useTranslation();
  const { fullName, professionalTitle, photoUrl, photoSize, dateFormat, setField } = useCvStore();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField('photoUrl', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <FormSection title={t('sections.header')}>
      <label className="field-label">
        {t('fields.fullName')}
        <input
          type="text"
          value={fullName}
          onChange={(e) => setField('fullName', e.target.value)}
        />
      </label>
      <label className="field-label">
        {t('fields.professionalTitle')}
        <input
          type="text"
          value={professionalTitle}
          onChange={(e) => setField('professionalTitle', e.target.value)}
        />
      </label>
      <label className="field-label">
        {t('fields.photoUrl')}
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setField('photoUrl', e.target.value)}
        />
      </label>
      <label className="field-label">
        {t('fields.uploadPhoto')}
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      </label>
      <label className="field-label">
        {t('fields.photoSize')}: {photoSize}px
        <input
          type="range"
          min={80}
          max={300}
          step={10}
          value={photoSize}
          onChange={(e) => setField('photoSize', Number(e.target.value))}
        />
      </label>
      <label className="field-label">
        {t('fields.dateFormat')}
        <select
          value={dateFormat}
          onChange={(e) => setField('dateFormat', e.target.value as DateFormat)}
        >
          <option value="raw">{t('fields.dateFormatRaw')}</option>
          <option value="short">{t('fields.dateFormatShort')}</option>
          <option value="long">{t('fields.dateFormatLong')}</option>
          <option value="numeric">{t('fields.dateFormatNumeric')}</option>
        </select>
      </label>
    </FormSection>
  );
}
