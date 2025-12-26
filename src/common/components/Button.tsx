
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  style, // Destructure style to merge it manually
  ...props 
}) => {
  const baseStyles = "relative font-tech font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden outline-none";
  
  const variants = {
    primary: "bg-neon-blue/10 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]",
    secondary: "bg-space-800 border border-slate-600 text-slate-400 hover:border-white hover:text-white hover:bg-white/5",
    warning: "bg-neon-yellow/10 border border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-black hover:shadow-[0_0_20px_rgba(252,238,10,0.6)]",
    danger: "bg-neon-pink/10 border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black hover:shadow-[0_0_20px_rgba(255,0,60,0.6)]",
    ghost: "bg-transparent text-slate-500 hover:text-neon-blue border border-transparent hover:border-neon-blue/30"
  };

  // Increased padding/font for 1080p
  const sizeStyles = "px-10 py-4 text-xl md:text-2xl";

  return (
    <button 
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      style={{
        clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
        ...style // Merge passed styles (colors, etc.)
      }}
    >
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current opacity-60"></span>
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current opacity-60"></span>
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>
    </button>
  );
};
