import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import CountUpLib from 'react-countup';
import { LineChart as LineChartLib, Line as LineLib, ResponsiveContainer as ResponsiveContainerLib } from 'recharts';

// Safe ESM interop fallbacks
const CountUp = (CountUpLib as any).default || CountUpLib;
const LineChart = (LineChartLib as any).default || LineChartLib;
const Line = (LineLib as any).default || LineLib;
const ResponsiveContainer = (ResponsiveContainerLib as any).default || ResponsiveContainerLib;

interface StatCardProps {
  title: string;
  value: string;
  numericValue?: number;
  suffix?: string;
  decimals?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  glow?: boolean;
  gradientText?: boolean;
  sparklineData?: { value: number }[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  numericValue, 
  suffix = '', 
  decimals = 0,
  subtitle, 
  icon, 
  glow = false,
  gradientText = false,
  sparklineData 
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      variants={shouldReduceMotion ? {} : itemVariants}
      whileHover={shouldReduceMotion ? {} : { translateY: -2, scale: 1.01 }}
      className={`
        bg-surface-card rounded-2xl p-6 border transition-shadow duration-300
        ${glow ? 'border-brand-gold/30 glow-gold hover:glow-gold-strong' : 'border-surface-border hover:border-brand-gold/30'}
        flex flex-col justify-between relative overflow-hidden group
      `}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        {icon && <div className="text-brand-gold/70">{icon}</div>}
      </div>
      
      <div className="relative z-10 flex flex-col justify-end h-full">
        <div className={`
          text-3xl font-bold font-mono tracking-tight 
          ${gradientText ? 'text-gradient-gold' : (glow ? 'text-brand-gold' : 'text-white')}
        `}>
          {numericValue !== undefined && !shouldReduceMotion ? (
            <CountUp 
              end={numericValue} 
              decimals={decimals} 
              duration={1} 
              separator="," 
              suffix={suffix}
            />
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <div className="text-xs text-text-secondary mt-2">
            {subtitle}
          </div>
        )}
      </div>

      {/* Sparkline Background */}
      {sparklineData && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#D4AF37" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={!shouldReduceMotion}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
