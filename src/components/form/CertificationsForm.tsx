import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import type { CertCategory } from '../../types/cv';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

function SortableItem({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className={className}>
      <button type="button" className="drag-handle" {...attributes} {...listeners}>&#9776;</button>
      {children}
    </div>
  );
}

function CertItemsList({ cat }: { cat: CertCategory }) {
  const { t } = useTranslation();
  const { updateCertItem, removeCertItem, addCertItem, reorderCertItems } = useCvStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const itemIds = cat.items.map((ci) => ci.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = itemIds.indexOf(String(active.id));
    const to = itemIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderCertItems(cat.id, from, to);
  };

  return (
    <div className="nested-section">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {cat.items.map((ci) => (
            <SortableItem key={ci.id} id={ci.id} className="nested-row">
              <input
                type="text"
                value={ci.name}
                onChange={(e) => updateCertItem(cat.id, ci.id, { name: e.target.value })}
                placeholder={t('fields.certName')}
              />
              <input
                type="text"
                value={ci.year}
                onChange={(e) => updateCertItem(cat.id, ci.id, { year: e.target.value })}
                placeholder={t('fields.year')}
                className="input-sm"
              />
              <button
                type="button"
                className="btn-remove-sm"
                onClick={() => {
                  if (confirm(t('actions.removeConfirm'))) removeCertItem(cat.id, ci.id);
                }}
              >&times;</button>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="btn-add-sm" onClick={() => addCertItem(cat.id)}>
        + {t('actions.add')}
      </button>
    </div>
  );
}

export default function CertificationsForm() {
  const { t } = useTranslation();
  const { certifications, addCertCategory, updateCertCategory, removeCertCategory, reorderList } = useCvStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const catIds = certifications.map((c) => c.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = catIds.indexOf(String(active.id));
    const to = catIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderList('certifications', from, to);
  };

  return (
    <FormSection title={t('sections.certifications')}>
      <div className="dynamic-list">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={catIds} strategy={verticalListSortingStrategy}>
            {certifications.map((cat: CertCategory) => (
              <SortableItem key={cat.id} id={cat.id} className="dynamic-list-item nested-card">
                <div className="dynamic-list-content">
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => updateCertCategory(cat.id, e.target.value)}
                    placeholder={t('fields.category')}
                  />
                  <CertItemsList cat={cat} />
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => {
                    if (confirm(t('actions.removeConfirm'))) removeCertCategory(cat.id);
                  }}
                >&times;</button>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <button type="button" className="btn-add" onClick={addCertCategory}>
          + {t('actions.add')}
        </button>
      </div>
    </FormSection>
  );
}
