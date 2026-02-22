import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import DynamicList from './DynamicList';
import type { ContactItem } from '../../types/cv';

const ICON_OPTIONS = [
  'fas fa-envelope',
  'fas fa-phone',
  'fas fa-map-marker-alt',
  'fab fa-linkedin',
  'fab fa-github',
  'fas fa-globe',
  'fas fa-link',
  'fab fa-twitter',
  'fab fa-instagram',
];

export default function ContactForm() {
  const { t } = useTranslation();
  const { contactItems, addContact, updateContact, removeContact, reorderList } = useCvStore();

  return (
    <FormSection title={t('sections.contact')}>
      <DynamicList<ContactItem>
        items={contactItems}
        onAdd={addContact}
        onRemove={(i) => removeContact(contactItems[i].id)}
        itemIds={contactItems.map((c) => c.id)}
        onReorder={(f, t) => reorderList('contactItems', f, t)}
        renderItem={(item) => (
          <div className="field-row">
            <select
              value={item.icon}
              onChange={(e) => updateContact(item.id, { icon: e.target.value })}
              className="icon-select"
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>{ic.split(' ').pop()}</option>
              ))}
            </select>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateContact(item.id, { text: e.target.value })}
              placeholder={t('fields.text')}
            />
          </div>
        )}
      />
    </FormSection>
  );
}
