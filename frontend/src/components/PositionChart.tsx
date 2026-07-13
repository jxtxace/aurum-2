import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { date: 'Mon', value: 100 },
  { date: 'Tue', value: 105 },
  { date: 'Wed', value: 108 },
  { date: 'Thu', value: 115 },
  { date: 'Fri', value: 125 },
  { date: 'Sat', value: 130 },
  { date: 'Sun', value: 142 },
];

export const PositionChart: React.FC = () => {
  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-surface-border">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-text-secondary">Position History</h3>
        <p className="text-xs text-text-secondary mt-1">Staked assets over the last 7 days</p>
      </div>
      
      <div className="h-64 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#181b22', 
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#D4AF37' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#D4AF37" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#goldGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
