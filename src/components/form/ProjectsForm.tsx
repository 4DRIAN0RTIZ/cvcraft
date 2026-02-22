import { useTranslation } from 'react-i18next';
import { useCvStore } from '../../store/useCvStore';
import FormSection from './FormSection';
import type { ProjectEntry } from '../../types/cv';
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

function DetailsList({ project }: { project: ProjectEntry }) {
  const { t } = useTranslation();
  const { updateProjectDetail, removeProjectDetail, addProjectDetail, reorderProjectDetails } = useCvStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const detailIds = project.details.map((_, i) => `det-${project.id}-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = detailIds.indexOf(String(active.id));
    const to = detailIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderProjectDetails(project.id, from, to);
  };

  return (
    <div className="nested-section">
      <span className="nested-label">{t('fields.details')}</span>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={detailIds} strategy={verticalListSortingStrategy}>
          {project.details.map((d, i) => (
            <SortableItem key={detailIds[i]} id={detailIds[i]} className="nested-row">
              <input
                type="text"
                value={d}
                onChange={(e) => updateProjectDetail(project.id, i, e.target.value)}
              />
              <button
                type="button"
                className="btn-remove-sm"
                onClick={() => {
                  if (confirm(t('actions.removeConfirm'))) removeProjectDetail(project.id, i);
                }}
              >&times;</button>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="btn-add-sm" onClick={() => addProjectDetail(project.id)}>
        + {t('actions.add')}
      </button>
    </div>
  );
}

export default function ProjectsForm() {
  const { t } = useTranslation();
  const { projects, addProject, updateProject, removeProject, reorderList } = useCvStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const projectIds = projects.map((p) => p.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = projectIds.indexOf(String(active.id));
    const to = projectIds.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderList('projects', from, to);
  };

  return (
    <FormSection title={t('sections.projects')}>
      <div className="dynamic-list">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
            {projects.map((proj: ProjectEntry) => (
              <SortableItem key={proj.id} id={proj.id} className="dynamic-list-item nested-card">
                <div className="dynamic-list-content">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                    placeholder={t('fields.title')}
                  />
                  <DetailsList project={proj} />
                </div>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => {
                    if (confirm(t('actions.removeConfirm'))) removeProject(proj.id);
                  }}
                >&times;</button>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <button type="button" className="btn-add" onClick={addProject}>
          + {t('actions.add')}
        </button>
      </div>
    </FormSection>
  );
}
