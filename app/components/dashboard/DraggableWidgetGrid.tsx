'use client'

import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { playSFX } from '../../../utils/audio';

interface DashboardWidget {
  id: string;
  component: React.ComponentType;
  title: string;
}

function WidgetItem({ widget }: { widget: DashboardWidget }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.id })
  const Component = widget.component;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="bg-[#1E1E2F]/80 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
    >
      <div className="text-white font-medium mb-2">{widget.title}</div>
      <Component />
    </div>
  )
}

export default function DraggableWidgetGrid({
  widgets,
}: {
  widgets: DashboardWidget[]
}) {
  const [items, setItems] = useState<DashboardWidget[]>(widgets)
  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    setItems(widgets)
  }, [widgets])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    
    playSFX('click');
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {items.map((widget) => (
            <WidgetItem key={widget.id} widget={widget} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
} 