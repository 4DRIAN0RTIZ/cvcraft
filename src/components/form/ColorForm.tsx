import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import { DEFAULT_COLOR_SCHEME } from '../../utils/defaultData';
import FormSection from './FormSection';
import type { ColorScheme } from '../../types/cv';

const COLOR_KEYS: (keyof ColorScheme)[] = [
  'headerBg', 'headerText', 'sidebarBg', 'accentColor', 'textColor', 'borderColor',
];

export default function ColorForm() {
  const { t } = useTranslation();
  const { colorScheme, updateColorScheme, setField } = useCvStore();

  const handleReset = () => {
    setField('colorScheme', { ...DEFAULT_COLOR_SCHEME });
  };

  return (
    <FormSection title={t('sections.colors')}>
      {COLOR_KEYS.map((key) => (
        <label key={key} className="field-label">
          {t(`colors.${key}`)}
          <div className="field-row">
            <input
              type="color"
              value={colorScheme?.[key] || DEFAULT_COLOR_SCHEME[key]}
              onChange={(e) => updateColorScheme(key, e.target.value)}
              style={{ width: 40, height: 32, padding: 2, cursor: 'pointer' }}
            />
            <input
              type="text"
              value={colorScheme?.[key] || DEFAULT_COLOR_SCHEME[key]}
              onChange={(e) => updateColorScheme(key, e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </label>
      ))}
      <button type="button" className="btn-add" onClick={handleReset}>
        {t('colors.reset')}
      </button>
    </FormSection>
  );
}
