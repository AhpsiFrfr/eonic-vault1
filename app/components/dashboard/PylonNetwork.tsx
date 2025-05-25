'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useEffect, useState } from 'react'
import { playSFX } from '../../../utils/audio'
import { GlowLevelProvider } from '../../../context/GlowLevelContext'
import SortablePylonWrapper from '../../../components/ui/SortablePylonWrapper'

interface PylonNetworkProps {
  pylons: string[];
  components: { [key: string]: React.ReactNode };
}

export default function PylonNetwork({ pylons, components }: PylonNetworkProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState(pylons);

  useEffect(() => {
    setItems(pylons);
  }, [pylons]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <GlowLevelProvider>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((name) => (
              <SortablePylonWrapper key={name} id={name}>
                <div
                  className="pylon pylon-active rounded-lg border border-neutral-800 bg-neutral-950/70 p-5 transition-all"
                  onClick={() => playSFX('click')}
                >
                  {components[name] || <div className="text-red-500">Missing Pylon: {name}</div>}
                </div>
              </SortablePylonWrapper>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </GlowLevelProvider>
  );
} 