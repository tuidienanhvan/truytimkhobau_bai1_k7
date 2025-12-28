
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatBarProps {
    label: string;
    value: number;
    icon: LucideIcon;
    iconColor: string;
    primaryColor: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, icon: Icon, iconColor, primaryColor }) => {
    return (
        <div className="flex items-center gap-4 mb-3">
            <div className="w-28 text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Icon size={14} className={iconColor} /> {label}
            </div>
            <div className="flex-1 h-2 bg-space-800 rounded-full overflow-hidden relative">
                <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                        width: `${value}%`, 
                        backgroundColor: primaryColor,
                        boxShadow: `0 0 10px ${primaryColor}`
                    }}
                ></div>
            </div>
            <div className="w-10 text-right font-mono text-white text-sm">{value}%</div>
        </div>
    );
};
