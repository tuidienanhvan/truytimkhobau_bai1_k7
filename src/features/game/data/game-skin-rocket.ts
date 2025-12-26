
export interface RocketStyle {
    id: string;
    name: string;
    description: string;
    primaryColor: string;
    glowColor?: string;
    scale: number;
    price: number;
}

export const ROCKET_SKINS: Record<string, RocketStyle> = {
    'apollo': {
        id: 'apollo',
        name: 'APOLLO PRIME',
        description: 'Tàu trinh sát tiêu chuẩn.',
        primaryColor: "#38BDF8", // Sky Blue
        glowColor: "#0EA5E9",
        scale: 1.1,
        price: 0 
    },
    'titan': {
        id: 'titan',
        name: 'TITAN OMEGA',
        description: 'Chiến hạm hạng nặng.',
        primaryColor: "#94A3B8", // Slate (Silver)
        glowColor: "#CBD5E1",
        scale: 1.1,
        price: 1000
    },
    'phantom': {
        id: 'phantom',
        name: 'NEON PHANTOM',
        description: 'Chiến đấu cơ tàng hình.',
        primaryColor: "#00F0FF", // Neon Cyan
        glowColor: "#22D3EE",
        scale: 1.0,
        price: 2500
    },
    'nova': {
        id: 'nova',
        name: 'NOVA DASH',
        description: 'Tốc độ vượt ánh sáng.',
        primaryColor: "#FDE047", // Yellow
        glowColor: "#FEF08A",
        scale: 1.2,
        price: 3000
    },
    'guardian': {
        id: 'guardian',
        name: 'IRON GUARDIAN',
        description: 'Lớp giáp siêu hợp kim.',
        primaryColor: "#4ADE80", // Green
        glowColor: "#86EFAC",
        scale: 1.2,
        price: 4000
    },
    'fury': {
        id: 'fury',
        name: 'OBSIDIAN FURY',
        description: 'Hỏa lực mạnh mẽ.',
        primaryColor: "#EF4444", // Red
        glowColor: "#F87171",
        scale: 1.2,
        price: 5000
    },
    'solar': {
        id: 'solar',
        name: 'SOLAR WING',
        description: 'Hấp thụ năng lượng sao.',
        primaryColor: "#FB923C", // Orange
        glowColor: "#FDBA74",
        scale: 1.4,
        price: 6500
    },
    'reaper': {
        id: 'reaper',
        name: 'VOID REAPER',
        description: 'Sát thủ từ hư không.',
        primaryColor: "#C084FC", // Purple
        glowColor: "#D8B4FE",
        scale: 1.1,
        price: 8000
    },
    'zenith': {
        id: 'zenith',
        name: 'GOLDEN ZENITH',
        description: 'Công nghệ hoàng gia.',
        primaryColor: "#F59E0B", // Amber/Gold
        glowColor: "#FBBF24",
        scale: 1.0,
        price: 10000
    },
    'cosmic': {
        id: 'cosmic',
        name: 'COSMIC DANCER',
        description: 'Vũ điệu của thiên hà.',
        primaryColor: "#EC4899", // Pink
        glowColor: "#F472B6",
        scale: 1.2,
        price: 12000
    },
    // --- NEW SHIPS ---
    'valkyrie': {
        id: 'valkyrie',
        name: 'VALKYRIE X',
        description: 'Nguyên mẫu siêu thanh.',
        primaryColor: "#F8FAFC", // White/Silver
        glowColor: "#FFFFFF",
        scale: 1.3,
        price: 15000
    },
    'biohazard': {
        id: 'biohazard',
        name: 'BIOHAZARD',
        description: 'Công nghệ sinh học ngoài hành tinh.',
        primaryColor: "#A3E635", // Lime
        glowColor: "#BEF264",
        scale: 1.2,
        price: 20000
    },
    'nebula': {
        id: 'nebula',
        name: 'NEBULA DRIFTER',
        description: 'Cỗ máy hơi nước không gian.',
        primaryColor: "#D97706", // Bronze/Amber
        glowColor: "#F59E0B",
        scale: 1.1,
        price: 25000
    },
    'midnight': {
        id: 'midnight',
        name: 'MIDNIGHT STALKER',
        description: 'Bóng ma của màn đêm.',
        primaryColor: "#6366F1", // Indigo
        glowColor: "#818CF8",
        scale: 1.2,
        price: 35000
    },
    'starlight': {
        id: 'starlight',
        name: 'STARLIGHT PRISM',
        description: 'Kết tinh từ bụi sao.',
        primaryColor: "#22D3EE", // Cyan/Crystal
        glowColor: "#67E8F9",
        scale: 1.4,
        price: 50000
    }
};

// Hàm trả về SVG string (Vector) 
export const getRocketSvg = (skinId: string) => {
    const skin = ROCKET_SKINS[skinId] || ROCKET_SKINS['apollo'];
    const c = skin.primaryColor;
    const g = skin.glowColor || c;

    // ViewBox Height tăng lên 150 để không cắt lửa
    const VIEW_BOX = "0 0 100 150";

    // Common Defs (Gradients & Filters)
    const defs = `
        <defs>
            <filter id="flameBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#0F172A" />
                <stop offset="0.5" stop-color="#334155" />
                <stop offset="1" stop-color="#0F172A" />
            </linearGradient>

            <linearGradient id="apolloBodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#E2E8F0" />
                <stop offset="0.5" stop-color="#FFFFFF" />
                <stop offset="1" stop-color="#E2E8F0" />
            </linearGradient>
            
            <linearGradient id="apolloWingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#0EA5E9" />
                <stop offset="1" stop-color="#0284C7" />
            </linearGradient>

            <!-- NOVA: Metallic Gold/Yellow Racer -->
            <linearGradient id="novaBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#B45309" />
                <stop offset="0.3" stop-color="#FCD34D" />
                <stop offset="0.5" stop-color="#FFFBEB" /> <!-- Highlight -->
                <stop offset="0.7" stop-color="#FCD34D" />
                <stop offset="1" stop-color="#B45309" />
            </linearGradient>
            <linearGradient id="novaEngine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#451a03" />
                <stop offset="0.5" stop-color="#78350f" />
                <stop offset="1" stop-color="#451a03" />
            </linearGradient>

            <!-- GUARDIAN: Industrial Green Tank -->
            <linearGradient id="guardianBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#14532D" />
                <stop offset="0.2" stop-color="#22C55E" />
                <stop offset="0.5" stop-color="#86EFAC" /> <!-- Highlight -->
                <stop offset="0.8" stop-color="#22C55E" />
                <stop offset="1" stop-color="#14532D" />
            </linearGradient>
            <linearGradient id="guardianGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#4ADE80" stop-opacity="0.9"/>
                <stop offset="1" stop-color="#166534" stop-opacity="0.6"/>
            </linearGradient>

            <!-- SOLAR: Energy Hologram -->
            <linearGradient id="solarWing" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#F97316" stop-opacity="0.2" />
                <stop offset="0.5" stop-color="#FDBA74" stop-opacity="0.6" />
                <stop offset="1" stop-color="#F97316" stop-opacity="0.2" />
            </linearGradient>
             <linearGradient id="solarCore" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#FFF7ED" />
                <stop offset="0.5" stop-color="#FB923C" />
                <stop offset="1" stop-color="#C2410C" />
            </linearGradient>

            <!-- REAPER: Void Purple -->
            <linearGradient id="reaperBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#3B0764" />
                <stop offset="0.5" stop-color="#6B21A8" />
                <stop offset="1" stop-color="#3B0764" />
            </linearGradient>
            <filter id="reaperGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#A855F7" />
            </filter>

            <!-- COSMIC: Iridescent Pearl -->
            <linearGradient id="cosmicBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#F472B6" />
                <stop offset="0.3" stop-color="#E879F9" />
                <stop offset="0.6" stop-color="#22D3EE" />
                <stop offset="1" stop-color="#F472B6" />
            </linearGradient>

            <!-- Shared Glass -->
            <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#38BDF8" stop-opacity="0.9"/>
                <stop offset="1" stop-color="#0EA5E9" stop-opacity="0.4"/>
            </linearGradient>

            <linearGradient id="furyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#450A0A" />
                <stop offset="0.5" stop-color="#991B1B" />
                <stop offset="1" stop-color="#450A0A" />
            </linearGradient>

             <linearGradient id="zenithGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#78350F" />
                <stop offset="0.3" stop-color="#FCD34D" />
                <stop offset="0.7" stop-color="#FCD34D" />
                <stop offset="1" stop-color="#78350F" />
            </linearGradient>
             <linearGradient id="glassZenith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#34D399" stop-opacity="0.9"/>
                <stop offset="1" stop-color="#059669" stop-opacity="0.5"/>
            </linearGradient>

            <!-- VALKYRIE: White/Silver High Tech -->
            <linearGradient id="valkyrieBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#94A3B8" />
                <stop offset="0.4" stop-color="#F8FAFC" />
                <stop offset="0.6" stop-color="#F8FAFC" />
                <stop offset="1" stop-color="#94A3B8" />
            </linearGradient>
            
            <!-- BIOHAZARD: Organic Slime -->
            <linearGradient id="bioGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#A3E635" />
                <stop offset="0.5" stop-color="#4D7C0F" />
                <stop offset="1" stop-color="#1A2E05" />
            </linearGradient>

            <!-- NEBULA: Bronze/Copper -->
            <linearGradient id="nebulaGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#78350F" />
                <stop offset="0.3" stop-color="#D97706" />
                <stop offset="0.7" stop-color="#D97706" />
                <stop offset="1" stop-color="#78350F" />
            </linearGradient>

            <!-- MIDNIGHT: Dark Indigo Stealth -->
            <linearGradient id="midnightGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#1E1B4B" />
                <stop offset="0.5" stop-color="#4338CA" />
                <stop offset="1" stop-color="#1E1B4B" />
            </linearGradient>

            <!-- STARLIGHT: Prism Gradient -->
            <linearGradient id="starlightGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#22D3EE" />
                <stop offset="0.5" stop-color="#E879F9" />
                <stop offset="1" stop-color="#818CF8" />
            </linearGradient>
        </defs>
    `;

    const createFlame = (x: number, y: number, scale: number = 1, delay: string = "0s") => `
        <g transform="translate(${x}, ${y}) scale(${scale})">
            <g>
                <animateTransform attributeName="transform" type="scale" values="1 1; 0.9 0.8; 1.05 1.1; 1 1" dur="0.15s" begin="${delay}" repeatCount="indefinite" />
                <path d="M-7 0 Q 0 45 7 0 L 0 -4 Z" fill="${g}" opacity="0.6" filter="url(#flameBlur)" />
                <path d="M-3 0 Q 0 25 3 0 L 0 -2 Z" fill="#FFFFFF" opacity="0.95" />
            </g>
        </g>
    `;

    switch (skinId) {
        case 'apollo': 
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 95, 1.4)}
                ${createFlame(35, 90, 0.6, "0.1s")}
                ${createFlame(65, 90, 0.6, "0.1s")}
                <path d="M50 40 L 95 95 L 65 90 L 50 85 L 35 90 L 5 95 Z" fill="url(#apolloWingGrad)" />
                <path d="M50 5 Q 75 40 70 85 L 50 95 L 30 85 Q 25 40 50 5" fill="url(#apolloBodyGrad)" />
                <path d="M30 85 L 35 60 L 40 88" stroke="#0EA5E9" stroke-width="2" fill="none" opacity="0.5"/>
                <path d="M70 85 L 65 60 L 60 88" stroke="#0EA5E9" stroke-width="2" fill="none" opacity="0.5"/>
                <path d="M50 25 C 65 25 65 50 50 55 C 35 50 35 25 50 25" fill="url(#glass)" stroke="#bae6fd" stroke-width="0.5" />
                <path d="M45 35 Q 50 30 55 35" stroke="white" stroke-width="1.5" opacity="0.7" stroke-linecap="round" />
            </svg>`;

        case 'titan': 
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(30, 92, 1.3)}
                ${createFlame(70, 92, 1.3)}
                <path d="M40 10 L 60 10 L 75 30 L 75 90 L 50 95 L 25 90 L 25 30 Z" fill="url(#bodyGrad)" stroke="${c}" stroke-width="0.5" />
                <path d="M25 40 L 15 50 L 15 85 L 25 80 Z" fill="#1E293B" stroke="${c}" stroke-width="0.5" />
                <path d="M75 40 L 85 50 L 85 85 L 75 80 Z" fill="#1E293B" stroke="${c}" stroke-width="0.5" />
                <rect x="35" y="30" width="30" height="15" fill="url(#glass)"/>
                <rect x="35" y="60" width="30" height="2" fill="${c}" opacity="0.5"/>
            </svg>`;

        case 'phantom': 
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 90, 1.6)}
                <path d="M50 5 L 95 85 L 50 78 L 5 85 Z" fill="url(#bodyGrad)" stroke="${c}" stroke-width="0.5" />
                <path d="M50 20 L 80 80 L 50 75 L 20 80 Z" fill="#000000" opacity="0.3" />
                <path d="M50 15 V 75" stroke="${c}" stroke-width="1.5" />
                <path d="M50 40 L 58 55 L 42 55 Z" fill="url(#glass)"/>
            </svg>`;

        case 'nova':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                <!-- Engines (Rear) -->
                ${createFlame(35, 95, 1.2)}
                ${createFlame(65, 95, 1.2)}
                
                <!-- Side Engines (3D Cylinders) -->
                <path d="M25 60 L 25 90 L 40 90 L 45 60 Z" fill="url(#novaEngine)" />
                <path d="M75 60 L 75 90 L 60 90 L 55 60 Z" fill="url(#novaEngine)" />
                
                <!-- Wings (Swept Forward) -->
                <path d="M50 30 L 90 60 L 80 85 L 50 70 L 20 85 L 10 60 Z" fill="#B45309" stroke="#78350f" stroke-width="0.5"/>
                
                <!-- Main Body (Needle Shape) -->
                <path d="M50 0 Q 70 50 60 95 L 50 100 L 40 95 Q 30 50 50 0" fill="url(#novaBody)" />
                
                <!-- Aerodynamic Lines -->
                <path d="M50 10 L 50 90" stroke="#78350f" stroke-width="0.5" opacity="0.3"/>
                
                <!-- Cockpit -->
                <path d="M50 40 L 55 55 L 45 55 Z" fill="url(#glass)"/>
                <path d="M50 42 L 50 52" stroke="white" stroke-width="1" opacity="0.8" stroke-linecap="round"/>
            </svg>`;

        case 'guardian':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(30, 95, 1.0)}
                ${createFlame(70, 95, 1.0)}
                ${createFlame(50, 92, 1.2)}

                <!-- Heavy Armor Plates (Left/Right) -->
                <path d="M20 40 L 35 30 L 40 90 L 15 90 L 10 60 Z" fill="#14532D" stroke="#166534" stroke-width="1"/>
                <path d="M80 40 L 65 30 L 60 90 L 85 90 L 90 60 Z" fill="#14532D" stroke="#166534" stroke-width="1"/>
                
                <!-- Center Fuselage -->
                <rect x="35" y="20" width="30" height="75" rx="5" fill="url(#guardianBody)" />
                
                <!-- Detail Lines (Rivets) -->
                <circle cx="25" cy="50" r="1.5" fill="#4ADE80" opacity="0.5"/>
                <circle cx="75" cy="50" r="1.5" fill="#4ADE80" opacity="0.5"/>
                <circle cx="25" cy="80" r="1.5" fill="#4ADE80" opacity="0.5"/>
                <circle cx="75" cy="80" r="1.5" fill="#4ADE80" opacity="0.5"/>

                <!-- Wide Cockpit -->
                <path d="M35 30 H 65 V 45 H 35 Z" fill="url(#guardianGlass)" />
                <path d="M40 32 L 60 32" stroke="white" stroke-width="1" opacity="0.5"/>
            </svg>`;

        case 'fury': 
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(32, 88, 1.2, "0s")}
                ${createFlame(68, 88, 1.2, "0.05s")}
                <path d="M50 0 L 65 30 L 100 45 L 75 85 L 50 75 L 25 85 L 0 45 L 35 30 Z" 
                      fill="url(#furyGrad)" stroke="#7F1D1D" stroke-width="1" />
                <path d="M50 15 L 60 40 L 50 80 L 40 40 Z" fill="#000000" opacity="0.4" />
                <circle cx="50" cy="50" r="4" fill="${c}" filter="drop-shadow(0 0 5px ${c})">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                </circle>
            </svg>`;

        case 'solar':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 95, 1.5)}
                
                <!-- Energy Sails (Semi-transparent Hologram) -->
                <path d="M50 50 Q 90 20 100 60 Q 90 100 50 80" fill="url(#solarWing)" stroke="#FDBA74" stroke-width="0.5" />
                <path d="M50 50 Q 10 20 0 60 Q 10 100 50 80" fill="url(#solarWing)" stroke="#FDBA74" stroke-width="0.5" />
                
                <!-- Sail Grid Lines -->
                <path d="M50 50 L 90 60" stroke="#FDBA74" stroke-width="0.5" opacity="0.5"/>
                <path d="M50 50 L 10 60" stroke="#FDBA74" stroke-width="0.5" opacity="0.5"/>
                <path d="M50 65 L 90 75" stroke="#FDBA74" stroke-width="0.5" opacity="0.3"/>
                <path d="M50 65 L 10 75" stroke="#FDBA74" stroke-width="0.5" opacity="0.3"/>

                <!-- Main Core -->
                <path d="M50 20 L 65 85 L 50 95 L 35 85 Z" fill="url(#solarCore)" />
                <circle cx="50" cy="50" r="8" fill="#FFFFFF" filter="drop-shadow(0 0 8px #F97316)"/>
            </svg>`;

        case 'reaper':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 90, 1.4)}
                
                <!-- Dark Energy Aura -->
                <g filter="url(#reaperGlow)">
                    <!-- Scythe Wings -->
                    <path d="M50 40 Q 90 20 95 80 L 80 60 L 50 70" fill="#3B0764"/>
                    <path d="M50 40 Q 10 20 5 80 L 20 60 L 50 70" fill="#3B0764"/>
                </g>

                <!-- Main Body (Spine) -->
                <path d="M50 10 L 60 30 L 55 90 L 45 90 L 40 30 Z" fill="url(#reaperBody)" stroke="#A855F7" stroke-width="1"/>
                
                <!-- Glowing Vents (Eyes) -->
                <path d="M48 25 L 52 25" stroke="#E879F9" stroke-width="2" stroke-linecap="round"/>
                <path d="M45 40 L 55 40" stroke="#E879F9" stroke-width="1" opacity="0.5"/>
                <path d="M45 50 L 55 50" stroke="#E879F9" stroke-width="1" opacity="0.3"/>
            </svg>`;

        case 'zenith': 
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 95, 1.8)}
                ${createFlame(25, 80, 0.5, "0.1s")}
                ${createFlame(75, 80, 0.5, "0.1s")}
                <path d="M50 0 L 75 40 L 70 95 L 30 95 L 25 40 Z" fill="url(#zenithGrad)" />
                <path d="M70 50 L 90 60 L 75 80 L 65 70 Z" fill="#B45309" stroke="${c}" stroke-width="0.5" />
                <path d="M30 50 L 10 60 L 25 80 L 35 70 Z" fill="#B45309" stroke="${c}" stroke-width="0.5" />
                <path d="M50 30 L 62 50 L 50 65 L 38 50 Z" fill="url(#glassZenith)" stroke="#FFFFFF" stroke-width="0.5" />
            </svg>`;

        case 'cosmic':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 95, 1.5)}
                
                <!-- Organic Curves -->
                <path d="M50 10 C 20 30 10 60 50 90 C 90 60 80 30 50 10" fill="url(#cosmicBody)" />
                
                <!-- Floating Rings (Alien Tech) -->
                <ellipse cx="50" cy="50" rx="35" ry="10" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.8" transform="rotate(-15 50 50)" />
                <ellipse cx="50" cy="50" rx="35" ry="10" stroke="#FFFFFF" stroke-width="1.5" fill="none" opacity="0.8" transform="rotate(15 50 50)" />
                
                <!-- Pearl Core -->
                <circle cx="50" cy="35" r="5" fill="#FFFFFF" filter="drop-shadow(0 0 5px #F472B6)"/>
                
                <!-- Spine -->
                <path d="M50 10 L 50 90" stroke="#FFFFFF" stroke-width="1" opacity="0.3" />
            </svg>`;
            
        case 'valkyrie':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(40, 95, 1.2)}
                ${createFlame(60, 95, 1.2)}
                
                <!-- Long Needle Body -->
                <path d="M50 0 L 60 40 L 55 90 L 45 90 L 40 40 Z" fill="url(#valkyrieBody)" />
                
                <!-- Forward Swept Wings -->
                <path d="M40 50 L 10 30 L 25 70 L 40 60 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="0.5"/>
                <path d="M60 50 L 90 30 L 75 70 L 60 60 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="0.5"/>
                
                <!-- Engine Blocks -->
                <rect x="35" y="70" width="10" height="20" fill="#475569" />
                <rect x="55" y="70" width="10" height="20" fill="#475569" />
                
                <!-- Detail Blue Lines -->
                <path d="M50 20 L 50 80" stroke="#38BDF8" stroke-width="1" opacity="0.6"/>
            </svg>`;
            
        case 'biohazard':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 90, 1.4)}
                
                <!-- Insectoid Body -->
                <path d="M50 10 Q 80 30 70 80 Q 50 100 30 80 Q 20 30 50 10" fill="url(#bioGrad)" stroke="#1A2E05" stroke-width="1"/>
                
                <!-- Mandibles -->
                <path d="M30 80 Q 10 70 20 50" stroke="#A3E635" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M70 80 Q 90 70 80 50" stroke="#A3E635" stroke-width="3" fill="none" stroke-linecap="round"/>
                
                <!-- Glowing Green Pustules -->
                <circle cx="50" cy="40" r="10" fill="#BEF264" filter="drop-shadow(0 0 5px #A3E635)"/>
                <circle cx="50" cy="40" r="5" fill="#FFFFFF" opacity="0.5"/>
                
                <circle cx="35" cy="60" r="4" fill="#65A30D"/>
                <circle cx="65" cy="60" r="4" fill="#65A30D"/>
            </svg>`;

        case 'nebula':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(30, 95, 1.0)}
                ${createFlame(70, 95, 1.0)}
                
                <!-- Main Cylindrical Body -->
                <rect x="40" y="20" width="20" height="70" rx="2" fill="url(#nebulaGrad)" />
                
                <!-- Side Boosters -->
                <rect x="20" y="50" width="15" height="40" rx="2" fill="#78350F" />
                <rect x="65" y="50" width="15" height="40" rx="2" fill="#78350F" />
                
                <!-- Piping details -->
                <path d="M40 30 H 20" stroke="#F59E0B" stroke-width="2"/>
                <path d="M60 30 H 80" stroke="#F59E0B" stroke-width="2"/>
                
                <!-- Porthole -->
                <circle cx="50" cy="40" r="6" fill="#0EA5E9" stroke="#1E293B" stroke-width="2"/>
                
                <!-- Gears (Decorative) -->
                <circle cx="50" cy="70" r="5" stroke="#92400E" stroke-width="2" stroke-dasharray="2 2" />
            </svg>`;
            
        case 'midnight':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 95, 1.3)}
                
                <!-- Stealth Bat Shape -->
                <path d="M50 10 L 70 40 L 95 30 L 80 80 L 55 90 L 50 80 L 45 90 L 20 80 L 5 30 L 30 40 Z" fill="url(#midnightGrad)" />
                
                <!-- Jagged Edges -->
                <path d="M50 10 L 50 80" stroke="#1E1B4B" stroke-width="1"/>
                <path d="M5 30 L 20 80" stroke="#4338CA" stroke-width="0.5"/>
                <path d="M95 30 L 80 80" stroke="#4338CA" stroke-width="0.5"/>
                
                <!-- Glowing Visor -->
                <path d="M40 35 L 60 35 L 50 45 Z" fill="#818CF8" filter="drop-shadow(0 0 2px #6366F1)"/>
            </svg>`;
            
        case 'starlight':
            return `
            <svg viewBox="${VIEW_BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${createFlame(50, 95, 1.6)}
                
                <!-- Diamond Prism Body -->
                <path d="M50 10 L 75 50 L 50 90 L 25 50 Z" fill="url(#starlightGrad)" opacity="0.9"/>
                
                <!-- Internal Facets -->
                <path d="M50 10 L 50 90" stroke="white" stroke-width="0.5" opacity="0.5"/>
                <path d="M25 50 L 75 50" stroke="white" stroke-width="0.5" opacity="0.5"/>
                
                <!-- Floating Bits -->
                <rect x="15" y="30" width="5" height="20" fill="#67E8F9" opacity="0.8">
                     <animate attributeName="y" values="30;35;30" dur="2s" repeatCount="indefinite"/>
                </rect>
                <rect x="80" y="30" width="5" height="20" fill="#67E8F9" opacity="0.8">
                     <animate attributeName="y" values="30;25;30" dur="2s" repeatCount="indefinite"/>
                </rect>
                
                <!-- Core Light -->
                <circle cx="50" cy="50" r="10" fill="white" opacity="0.4" filter="drop-shadow(0 0 10px white)"/>
            </svg>`;

        default: return '';
    }
};
