import { useTranslation } from 'react-i18next';

interface DateRangeProps {
  dateFormat: string;
  // Raw text mode
  rawValue?: string;
  onRawChange?: (value: string) => void;
  // Structured mode - start
  startMonth?: number;
  startYear?: number;
  onStartMonthChange?: (month: number | undefined) => void;
  onStartYearChange?: (year: number | undefined) => void;
  // Structured mode - end
  endMonth?: number;
  endYear?: number;
  onEndMonthChange?: (month: number | undefined) => void;
  onEndYearChange?: (year: number | undefined) => void;
  // Current toggle
  isCurrent?: boolean;
  onCurrentChange?: (isCurrent: boolean) => void;
  // Single date mode (education)
  singleDate?: boolean;
}

export default function DateRangeInput({
  dateFormat,
  rawValue,
  onRawChange,
  startMonth,
  startYear,
  onStartMonthChange,
  onStartYearChange,
  endMonth,
  endYear,
  onEndMonthChange,
  onEndYearChange,
  isCurrent,
  onCurrentChange,
  singleDate,
}: DateRangeProps) {
  const { t } = useTranslation();

  if (dateFormat === 'raw') {
    return (
      <input
        type="text"
        value={rawValue || ''}
        onChange={(e) => onRawChange?.(e.target.value)}
        placeholder={t('fields.date')}
      />
    );
  }

  const monthSelect = (value: number | undefined, onChange: ((m: number | undefined) => void) | undefined) => (
    <select
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
      style={{ flex: 1 }}
    >
      <option value="">{t('fields.month')}</option>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
        <option key={m} value={m}>{t(`months.${m}`)}</option>
      ))}
    </select>
  );

  const yearInput = (value: number | undefined, onChange: ((y: number | undefined) => void) | undefined) => (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
      placeholder={t('fields.year')}
      min={1900}
      max={2100}
      style={{ width: 80 }}
    />
  );

  if (singleDate) {
    return (
      <div className="field-row">
        {monthSelect(startMonth, onStartMonthChange)}
        {yearInput(startYear, onStartYearChange)}
      </div>
    );
  }

  return (
    <div className="field-group" style={{ gap: 6 }}>
      <span className="nested-label">{t('fields.startDate')}</span>
      <div className="field-row">
        {monthSelect(startMonth, onStartMonthChange)}
        {yearInput(startYear, onStartYearChange)}
      </div>
      <span className="nested-label">{t('fields.endDate')}</span>
      <div className="field-row">
        {!isCurrent && monthSelect(endMonth, onEndMonthChange)}
        {!isCurrent && yearInput(endYear, onEndYearChange)}
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85em', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={isCurrent || false}
            onChange={(e) => onCurrentChange?.(e.target.checked)}
          />
          {t('fields.currentJob')}
        </label>
      </div>
    </div>
  );
}
