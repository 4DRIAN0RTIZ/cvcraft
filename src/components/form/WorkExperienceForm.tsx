import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import DateRangeInput from './DateRangeInput';
import type { JobEntry } from '../../types/cv';
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

function AchievementList({ job }: { job: JobEntry }) {
  const { t } = useTranslation();
  const { updateAchievement, removeAchievement, addAchievement, reorderAchievements } = useCvStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const achIds = job.achievements.map((_, i) => `ach-${job.id}-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = achIds.indexOf(String(active.id));
    const to = achIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderAchievements(job.id, from, to);
  };

  return (
    <div className="nested-section">
      <span className="nested-label">{t('fields.achievements')}</span>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={achIds} strategy={verticalListSortingStrategy}>
          {job.achievements.map((ach, i) => (
            <SortableItem key={achIds[i]} id={achIds[i]} className="nested-row">
              <input
                type="text"
                value={ach}
                onChange={(e) => updateAchievement(job.id, i, e.target.value)}
              />
              <button
                type="button"
                className="btn-remove-sm"
                onClick={() => {
                  if (confirm(t('actions.removeConfirm'))) removeAchievement(job.id, i);
                }}
              >&times;</button>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="btn-add-sm" onClick={() => addAchievement(job.id)}>
        + {t('actions.add')}
      </button>
    </div>
  );
}

export default function WorkExperienceForm() {
  const { t } = useTranslation();
  const {
    workExperience, dateFormat, addJob, updateJob, removeJob, reorderList,
  } = useCvStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const jobIds = workExperience.map((j) => j.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = jobIds.indexOf(String(active.id));
    const to = jobIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderList('workExperience', from, to);
  };

  return (
    <FormSection title={t('sections.workExperience')}>
      <div className="dynamic-list">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
            {workExperience.map((job: JobEntry) => (
              <SortableItem key={job.id} id={job.id} className="dynamic-list-item nested-card">
                <div className="dynamic-list-content">
                  <div className="field-group">
                    <input
                      type="text"
                      value={job.title}
                      onChange={(e) => updateJob(job.id, { title: e.target.value })}
                      placeholder={t('fields.title')}
                    />
                    <input
                      type="text"
                      value={job.company}
                      onChange={(e) => updateJob(job.id, { company: e.target.value })}
                      placeholder={t('fields.company')}
                    />
                    <DateRangeInput
                      dateFormat={dateFormat}
                      rawValue={job.date}
                      onRawChange={(v) => updateJob(job.id, { date: v })}
                      startMonth={job.startMonth}
                      startYear={job.startYear}
                      onStartMonthChange={(m) => updateJob(job.id, { startMonth: m })}
                      onStartYearChange={(y) => updateJob(job.id, { startYear: y })}
                      endMonth={job.endMonth}
                      endYear={job.endYear}
                      onEndMonthChange={(m) => updateJob(job.id, { endMonth: m })}
                      onEndYearChange={(y) => updateJob(job.id, { endYear: y })}
                      isCurrent={job.isCurrent}
                      onCurrentChange={(c) => updateJob(job.id, { isCurrent: c })}
                    />
                  </div>
                  <AchievementList job={job} />
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => {
                    if (confirm(t('actions.removeConfirm'))) removeJob(job.id);
                  }}
                >&times;</button>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <button type="button" className="btn-add" onClick={addJob}>
          + {t('actions.add')}
        </button>
      </div>
    </FormSection>
  );
}
