"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const DocumentPreview = ({ title, color }) => (
  <motion.div 
    whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
    className="relative w-28 h-36 bg-white/10 backdrop-blur-sm rounded-md shadow-2xl border border-white/30 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 overflow-hidden"
  >
    <div className={`h-2 w-full bg-gradient-to-r ${color}`}></div>
    <div className="p-2 space-y-2">
      <div className="h-1.5 w-3/4 bg-white/30 rounded"></div>
      <div className="space-y-1">
        <div className="h-1 w-full bg-white/20 rounded"></div>
        <div className="h-1 w-full bg-white/20 rounded"></div>
        <div className="h-1 w-2/3 bg-white/20 rounded"></div>
      </div>
      <div className="flex gap-1 mt-4">
        <div className="h-4 w-4 bg-white/20 rounded-full"></div>
        <div className="h-4 w-4 bg-white/20 rounded-full"></div>
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 h-8 bg-white/10 border border-white/20 rounded-sm flex items-center p-1">
       <motion.div 
          initial={{ width: "0%" }} 
          animate={{ width: "100%" }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`h-1.5 bg-gradient-to-r ${color} rounded-sm`}
       ></motion.div>
    </div>
  </motion.div>
);
