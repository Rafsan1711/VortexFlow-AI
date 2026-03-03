import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ref, get, query, limitToLast, orderByKey } from 'firebase/database';
import { db } from '../../lib/firebase';
import { format, subHours } from 'date-fns';

interface LatencyData {
  timestamp: string;
  latency: number;
}

export const LatencyChart: React.FC = () => {
  const [data, setData] = useState<LatencyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const metricsRef = ref(db, 'statusMetrics');
      const metricsQuery = query(metricsRef, orderByKey(), limitToLast(24));
      
      try {
        const snapshot = await get(metricsQuery);
        if (snapshot.exists()) {
          const formattedData: any[] = [];
          snapshot.forEach((childSnapshot) => {
            const entry = childSnapshot.val();
            formattedData.push({
              timestamp: format(new Date(entry.timestamp), 'HH:mm'),
              latency: entry.latency
            });
          });
          setData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching latency metrics:', error);
      }
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 font-mono text-sm border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
        No latency data available yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-4 font-mono uppercase tracking-wider">
        API Response Time (Last 24h)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            stroke="#666" 
            tick={{ fill: '#666', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            tick={{ fill: '#666', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            unit="ms"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
            itemStyle={{ color: '#00D4FF', fontSize: '12px', fontFamily: 'monospace' }}
            labelStyle={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="latency" 
            stroke="#00D4FF" 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: '#00D4FF' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
