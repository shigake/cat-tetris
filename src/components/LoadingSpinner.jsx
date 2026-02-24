import React from 'react';
import { motion } from 'framer-motion';
// DO NOT infer by filename; use manifest aliases.
import { global as globalAssets } from '../config/assetPlacementManifest.js';

function LoadingSpinner({ size = 'md', message }) {
 const sizes = {
 sm: 'w-8 h-8',
 md: 'w-16 h-16',
 lg: 'w-24 h-24',
 xl: 'w-32 h-32'
 };

 const textSizes = {
 sm: 'text-sm',
 md: 'text-base',
 lg: 'text-lg',
 xl: 'text-xl'
 };

 return (
 <div className="flex flex-col items-center justify-center gap-4 p-8">

 <div className="relative">
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
 className={`${sizes[size]} flex items-center justify-center`}
 >
 <div className="w-10 h-10 border-4 border-purple-400/30 border-t-purple-400 rounded-full" />
 </motion.div>
 <motion.img
 src={globalAssets.loadingSpinner.centerCat}
 alt=""
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
 animate={{ scale: [1, 1.1, 1] }}
 transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
 />
 </div>

 <div className="flex gap-1.5">
 {[1, 2, 3].map((_, i) => (
 <motion.img
 key={i}
 src={globalAssets.loadingSpinner.pawDots}
 alt=""
 className="w-5 h-4 object-contain"
 animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
 transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
 />
 ))}
 </div>

 {message && (
 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className={`text-white/80 font-medium ${textSizes[size]}`}
 >
 {message}
 </motion.p>
 )}
 </div>
 );
}

export default LoadingSpinner;
