
import React from 'react';

export const LoadingScreen: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-space-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      <div className="text-neon-blue font-tech tracking-widest animate-pulse">ĐANG TẢI DỮ LIỆU...</div>
    </div>
  </div>
);
