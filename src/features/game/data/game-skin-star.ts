
export type StarType = 'locked' | 'passed' | 'current' | 'target';

interface StarStyle {
    color: string;
    glowColor: string;
    opacity: string;
    centerColor: string;
    showGlow: boolean;
    size: number;
}

export const getStarStyle = (type: StarType): StarStyle => {
    switch (type) {
        case 'locked':
            return {
                color: '#334155',
                glowColor: 'rgba(51, 65, 85, 0.2)',
                opacity: '0.6',
                centerColor: '#475569',
                showGlow: true, // Bật glow nhẹ cho locked
                size: 42 // Tăng từ 30 lên 42
            };
        case 'passed':
            return {
                color: '#0AFF60',
                glowColor: 'rgba(10, 255, 96, 0.4)',
                centerColor: '#0AFF60',
                opacity: '0.8',
                showGlow: true,
                size: 32
            };
        case 'current':
            return {
                color: '#00F0FF',
                glowColor: 'rgba(0, 240, 255, 0.6)',
                centerColor: '#FFFFFF',
                opacity: '1',
                showGlow: true,
                size: 36
            };
        case 'target':
            return {
                color: '#FCEE0A',
                glowColor: 'rgba(252, 238, 10, 0.8)',
                centerColor: '#FFFFFF',
                opacity: '1',
                showGlow: true,
                size: 60 
            };
        default:
            return {
                color: '#1E293B',
                glowColor: 'transparent',
                opacity: '1',
                centerColor: 'transparent',
                showGlow: false,
                size: 30
            };
    }
};

export const getStarSvg = (type: StarType) => {
    const style = getStarStyle(type);

    return `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <defs>
            <filter id="starGlow_${type}" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="coreGrad_${type}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="${style.centerColor}" />
                <stop offset="100%" stop-color="${style.color}" />
            </radialGradient>
        </defs>
        
        <!-- 1. Aura / Glow Background (Pulsing Opacity) -->
        ${style.showGlow ? `
            <circle cx="50" cy="50" r="35" fill="${style.glowColor}" filter="url(#starGlow_${type})" opacity="0.4">
                <animate attributeName="opacity" values="${type === 'locked' ? '0.1;0.3;0.1' : '0.1;0.5;0.1'}" dur="${type === 'locked' ? '4s' : '2s'}" repeatCount="indefinite" />
            </circle>
        ` : ''}

        <!-- 2. Outer Rotating Ring (Dashed) -->
        ${(type === 'target' || type === 'current') ? `
            <circle cx="50" cy="50" r="42" stroke="${style.color}" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
            </circle>
        ` : ''}

        <!-- 3. HUD Lock-on Brackets (Chỉ dành cho Target) -->
        ${type === 'target' ? `
            <g stroke="${style.color}" stroke-width="2.5" stroke-linecap="round">
                <path d="M35 20 L 20 20 L 20 35" />
                <path d="M65 20 L 80 20 L 80 35" />
                <path d="M35 80 L 20 80 L 20 65" />
                <path d="M65 80 L 80 80 L 80 65" />
                <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
            </g>
        ` : ''}

        <!-- 4. The Core Body (Diamond / Rhombus) -->
        <path d="M50 22 L 62 42 L 82 50 L 62 58 L 50 78 L 38 58 L 18 50 L 38 42 Z" 
            fill="url(#coreGrad_${type})" 
            stroke="${style.color}" 
            stroke-width="2.5" 
            stroke-linejoin="round"
            opacity="${style.opacity}">
            ${type === 'locked' ? `
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
            ` : ''}
        </path>

        <!-- 5. Inner Core Energy Dot -->
        <circle cx="50" cy="50" r="6" fill="${style.centerColor}" opacity="1">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
        
        <!-- 6. Current Step Signal Indicator -->
        ${type === 'current' ? `
            <circle cx="50" cy="50" r="8" stroke="${style.color}" stroke-width="1">
                <animate attributeName="r" values="8;45" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
            </circle>
        ` : ''}
    </svg>`;
};
