import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  addLabel?: string;
  itemIds?: string[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="dynamic-list-item">
      <button type="button" className="drag-handle" {...attributes} {...listeners}>
        &#9776;
      </button>
      {children}
    </div>
  );
}

export default function DynamicList<T>({ items, onAdd, onRemove, renderItem, addLabel, itemIds, onReorder }: Props<T>) {
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const ids = itemIds || items.map((_, i) => String(i));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) onReorder(from, to);
  };

  const content = items.map((item, i) => {
    const itemContent = (
      <>
        <div className="dynamic-list-content">{renderItem(item, i)}</div>
        <button
          type="button"
          className="btn-remove"
          onClick={() => {
            if (confirm(t('actions.removeConfirm'))) onRemove(i);
          }}
          title={t('actions.remove')}
        >
          &times;
        </button>
      </>
    );

    if (onReorder) {
      return (
        <SortableItem key={ids[i]} id={ids[i]}>
          {itemContent}
        </SortableItem>
      );
    }

    return (
      <div key={i} className="dynamic-list-item">
        {itemContent}
      </div>
    );
  });

  return (
    <div className="dynamic-list">
      {onReorder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {content}
          </SortableContext>
        </DndContext>
      ) : (
        content
      )}
      <button type="button" className="btn-add" onClick={onAdd}>
        + {addLabel || t('actions.add')}
      </button>
    </div>
  );
}
