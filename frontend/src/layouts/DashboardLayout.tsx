import React from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { motion, useReducedMotion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex relative">
      {/* Ambient Background Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[80%] h-[80%] rounded-full bg-brand-gold/5 blur-[120px]"></div>
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30"></div>
      </div>

      {/* Sidebar with entrance animation */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="hidden lg:block z-10"
      >
        <Sidebar />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-7xl mx-auto w-full relative z-10">
        <motion.main 
          className="flex-1 p-4 md:p-8"
          variants={contentVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          animate="visible"
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
};
