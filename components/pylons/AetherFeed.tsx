import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rss, Zap, AlertTriangle, Star, Radio } from 'lucide-react';

interface AetherEvent {
  id: string;
  type: 'dimensional_shift' | 'energy_spike' | 'portal_activity' | 'anomaly' | 'broadcast';
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const eventTypes = {
  dimensional_shift: { icon: Zap, color: 'text-cyan-400' },
  energy_spike: { icon: Star, color: 'text-yellow-400' },
  portal_activity: { icon: Radio, color: 'text-purple-400' },
  anomaly: { icon: AlertTriangle, color: 'text-red-400' },
  broadcast: { icon: Rss, color: 'text-green-400' }
};

const sampleEvents: Omit<AetherEvent, 'id' | 'timestamp'>[] = [
  { type: 'dimensional_shift', message: 'Phase variance detected in Sector 7', priority: 'medium' },
  { type: 'energy_spike', message: 'Quantum resonance peak at 432.8 Hz', priority: 'low' },
  { type: 'portal_activity', message: 'RefraGate activation sequence initiated', priority: 'high' },
  { type: 'anomaly', message: 'Temporal distortion in dimensional matrix', priority: 'critical' },
  { type: 'broadcast', message: 'ENIC.0 system update completed', priority: 'low' },
  { type: 'dimensional_shift', message: 'Stabilizing phase locks across all sectors', priority: 'medium' },
  { type: 'energy_spike', message: 'Harmonic convergence detected', priority: 'low' },
  { type: 'portal_activity', message: 'Gateway synchronization established', priority: 'medium' }
];

export default function AetherFeed() {
  const [events, setEvents] = useState<AetherEvent[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high'>('all');

  useEffect(() => {
    if (!isActive) return;

    const generateEvent = () => {
      const eventTemplate = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newEvent: AetherEvent = {
        ...eventTemplate,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date()
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
    };

    // Initial events
    for (let i = 0; i < 3; i++) {
      setTimeout(generateEvent, i * 1000);
    }

    // Continue generating events
    const interval = setInterval(generateEvent, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.priority === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="pylon relative overflow-hidden">
      {/* Flowing data stream background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
          animate={{ y: [-100, 400] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-glow flex items-center gap-2">
            <Rss className="w-5 h-5 text-green-400" />
            Aether Feed
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-1 rounded transition-colors ${
                isActive ? 'text-green-400 bg-green-400/20' : 'text-gray-400 bg-gray-400/20'
              }`}
            >
              <Radio className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-800/30 rounded-lg">
          <motion.div
            className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}
            animate={isActive ? {
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-sm text-gray-300">
            {isActive ? 'Live Feed Active' : 'Feed Paused'}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {filteredEvents.length} events
          </span>
        </div>

        {/* Events feed */}
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          <AnimatePresence>
            {filteredEvents.map((event, index) => {
              const EventIcon = eventTypes[event.type].icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded-lg border-l-2 ${getPriorityColor(event.priority)}`}
                >
                  <div className="flex items-start gap-2">
                    <EventIcon className={`w-4 h-4 mt-0.5 ${eventTypes[event.type].color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 leading-tight">
                        {event.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          event.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                          event.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {event.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Rss className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No events to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 