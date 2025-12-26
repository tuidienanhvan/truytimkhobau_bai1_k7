
import React from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';

export const MissionBriefing: React.FC = () => {
  return (
    <div className="col-span-3 flex flex-col justify-center space-y-8">
        {/* Mission Card */}
        <div className="group relative bg-space-900/40 p-8 border border-slate-700/50 rounded-xl backdrop-blur-sm transition-all hover:bg-space-900/80 hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(10,255,96,0.1)]">
            <div className="absolute -top-3 left-6 px-2 bg-space-950 text-neon-green text-xs font-bold tracking-[0.2em] border border-neon-green/30 rounded uppercase">
                Nhiệm vụ chính
            </div>
            <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20">
                    <Terminal size={24} />
                </div>
                <div>
                    <h3 className="text-xl text-white font-bold mb-2 uppercase">Giải Mã Tọa Độ</h3>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Sử dụng kiến thức <span className="text-neon-green">Số Hữu Tỉ</span> để xác định vị trí các thiên thể và nạp năng lượng.
                    </p>
                </div>
            </div>
        </div>

        {/* Safety Card */}
        <div className="group relative bg-space-900/40 p-8 border border-slate-700/50 rounded-xl backdrop-blur-sm transition-all hover:bg-space-900/80 hover:border-neon-pink/50 hover:shadow-[0_0_30px_rgba(255,0,60,0.1)]">
            <div className="absolute -top-3 left-6 px-2 bg-space-950 text-neon-pink text-xs font-bold tracking-[0.2em] border border-neon-pink/30 rounded uppercase">
                Cảnh báo
            </div>
            <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded bg-neon-pink/10 flex items-center justify-center text-neon-pink border border-neon-pink/20">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="text-xl text-white font-bold mb-2 uppercase">Khiên Chắn</h3>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Sai số sẽ làm hỏng khiên chắn. Mất khiên chắn đồng nghĩa với việc <span className="text-neon-pink">thất bại</span>.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
