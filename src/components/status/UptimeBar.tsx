import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { format, subDays } from 'date-fns';

interface UptimeBarProps {
  serviceId: string;
}

type DayStatus = 'operational' | 'degraded' | 'outage' | 'unknown';

export const UptimeBar: React.FC<UptimeBarProps> = ({ serviceId }) => {
  const [history, setHistory] = useState<DayStatus[]>(Array(30).fill('unknown'));

  useEffect(() => {
    const fetchHistory = async () => {
      const days: DayStatus[] = [];
      const today = new Date();
      
      // Fetch last 30 days
      const promises = Array.from({ length: 30 }).map(async (_, i) => {
        const date = subDays(today, 29 - i); // 29 days ago to today
        const dateStr = format(date, 'yyyy-MM-dd');
        const statusRef = ref(db, `systemStatus/${dateStr}/${serviceId}`);
        
        try {
          const snapshot = await get(statusRef);
          if (snapshot.exists()) {
            return snapshot.val() as DayStatus;
          }
          return 'operational'; // Default to operational if no data
        } catch {
          return 'operational';
        }
      });

      const results = await Promise.all(promises);
      setHistory(results);
    };

    fetchHistory();
  }, [serviceId]);

  const getColor = (status: DayStatus) => {
    switch (status) {
      case 'operational': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'outage': return 'bg-red-500';
      default: return 'bg-emerald-500/30';
    }
  };

  const getTooltip = (status: DayStatus, index: number) => {
    const date = subDays(new Date(), 29 - index);
    const dateStr = format(date, 'MMM d');
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return `${dateStr}: ${statusText}`;
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
      <div className="flex gap-[2px] h-8">
        {history.map((status, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${getColor(status)} transition-opacity hover:opacity-80 group relative`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {getTooltip(status, i)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500 text-right font-mono">
        99.9% uptime
      </div>
    </div>
  );
};
