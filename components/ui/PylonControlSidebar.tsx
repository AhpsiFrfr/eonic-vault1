'use client';
import {
  DndContext, closestCenter,
  useSensor, useSensors, PointerSensor,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight, FaCoins, FaStar, FaShieldAlt, FaClock, FaBullhorn, FaVolumeUp, FaSlidersH } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PylonState {
  [key: string]: boolean;
}

interface PylonControlSidebarProps {
  state: PylonState;
  onToggle: (id: string) => void;
}

interface SortableItemProps {
  id: string;
  toggle: (id: string) => void;
  active: boolean;
}

const icons: Record<string, JSX.Element> = {
  'Token': <FaCoins className="text-yellow-400" />,
  'XP Tracker': <FaStar className="text-blue-400" />,
  'Vault Reputation': <FaShieldAlt className="text-purple-400" />,
  'Timepiece Evolution': <FaClock className="text-blue-300" />,
  'Announcements': <FaBullhorn className="text-pink-400" />,
  'Audio Control': <FaVolumeUp className="text-indigo-400" />,
  'Audio Settings': <FaSlidersH className="text-purple-300" />
};

const pylonGroups: Record<string, string[]> = {
  "System": ['Token', 'XP Tracker', 'Vault Reputation', 'Timepiece Evolution'],
  "Interface": ['Announcements', 'Audio Control', 'Audio Settings']
};

function SortableItem({ id, toggle, active }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      whileHover={{ x: -5 }}
      className="flex justify-between items-center text-sm text-gray-300 hover:text-white cursor-move p-2 hover:bg-[#1e1e1e] rounded-lg"
    >
      <div className="flex items-center space-x-2">
        {icons[id]}
        <span>{id}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle(id);
        }}
        className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors duration-300 ${active ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}
      >
        {active ? 'On' : 'Off'}
      </button>
    </motion.li>
  );
}

export default function PylonControlSidebar({ state, onToggle }: PylonControlSidebarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [items, setItems] = useState<string[]>(Object.keys(state));
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollPosition(progress);
    }
  };

  const handleAutoScroll = () => {
    if (contentRef.current) {
      const isAtBottom = scrollPosition > 90;
      const targetScroll = isAtBottom ? 0 : contentRef.current.scrollHeight;
      
      contentRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
      onClick={handleAutoScroll}
      className={`fixed top-[100px] right-0 z-50 transition-all duration-300 ${open ? 'w-64' : 'w-10'} h-[calc(100vh-120px)] bg-[#121212]/90 border-l border-[#1f1f1f] shadow-[0_0_15px_rgba(0,212,255,0.3)] backdrop-blur-lg rounded-l-2xl`}
      initial={false}
      animate={{
        width: open ? 256 : 40,
      }}
    >
      <motion.div 
        className="flex justify-center items-center h-10 cursor-pointer bg-[#181818] hover:bg-[#1e1e1e] rounded-l-xl"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {open ? (
              <FaAngleRight className="text-white" />
            ) : (
              <FaAngleLeft className="text-[#00d4ff] text-lg" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            onScroll={handleScroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[calc(100%-40px)] px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-track-[#181818] scrollbar-thumb-[#1e1e1e] hover:scrollbar-thumb-[#2e2e2e]"
          >
            <motion.h2 
              className="text-sm text-white font-semibold mb-3 tracking-wide"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              Pylon Controls
            </motion.h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {Object.entries(pylonGroups).map(([group, pylons]) => (
                  <motion.div 
                    key={group} 
                    className="mb-6"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                  >
                    <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-widest">{group}</h3>
                    <ul className="space-y-2">
                      {pylons.map((id) => (
                        <SortableItem key={id} id={id} toggle={onToggle} active={state[id]} />
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 