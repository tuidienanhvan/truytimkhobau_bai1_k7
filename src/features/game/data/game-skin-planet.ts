
export interface PlanetStyle {
    id: number;
    name: string;
    grad: string; // SVG Radial Gradient Stops
    ringColor: string;
    bodyColor: string;
    extra: string; // SVG Paths for texture details
}

export const PLANET_STYLES: PlanetStyle[] = [
    // 0. CYBER SATURN (Default - Blue/Purple)
    {
        id: 0,
        name: "Cyber Saturn",
        grad: `<stop stop-color="#4F46E5" /><stop offset="1" stop-color="#0F172A" />`,
        ringColor: "#00F0FF",
        bodyColor: "#6366F1",
        extra: `<path d="M40 70 Q 100 90 160 70" stroke="#6366F1" stroke-width="2" fill="none" opacity="0.5"/><path d="M40 130 Q 100 110 160 130" stroke="#6366F1" stroke-width="2" fill="none" opacity="0.5"/>`
    },
    // 1. INFERNO (Lava - Red/Orange)
    {
        id: 1,
        name: "Inferno",
        grad: `<stop stop-color="#EF4444" /><stop offset="1" stop-color="#7F1D1D" />`,
        ringColor: "#F97316",
        bodyColor: "#DC2626",
        extra: `<path d="M60 80 Q 90 60 120 90" stroke="#FCA5A5" stroke-width="3" opacity="0.6" stroke-linecap="round"/><circle cx="80" cy="120" r="8" fill="#7F1D1D" opacity="0.4"/>`
    },
    // 2. CRYOS (Ice - Cyan/White)
    {
        id: 2,
        name: "Cryos",
        grad: `<stop stop-color="#E0F2FE" /><stop offset="1" stop-color="#0EA5E9" />`,
        ringColor: "#FFFFFF",
        bodyColor: "#38BDF8",
        extra: `<path d="M50 100 L 80 85 L 100 110 L 120 80 L 150 100" stroke="#FFFFFF" stroke-width="3" opacity="0.5" stroke-linejoin="round"/>`
    },
    // 3. TOXIC (Acid - Green)
    {
        id: 3,
        name: "Toxic",
        grad: `<stop stop-color="#84CC16" /><stop offset="1" stop-color="#14532D" />`,
        ringColor: "#A3E635",
        bodyColor: "#4D7C0F",
        extra: `<circle cx="75" cy="75" r="12" fill="#365314" opacity="0.2"/><circle cx="125" cy="115" r="18" fill="#365314" opacity="0.2"/>`
    },
    // 4. NEON VORTEX (Plasma - Pink/Purple)
    {
        id: 4,
        name: "Neon Vortex",
        grad: `<stop stop-color="#D946EF" /><stop offset="1" stop-color="#701A75" />`,
        ringColor: "#F0ABFC",
        bodyColor: "#C026D3",
        extra: `<path d="M60 110 Q 100 60 140 110" stroke="#F5D0FE" stroke-width="3" opacity="0.4" fill="none"/>`
    },
    // 5. GOLDEN GIANT (Gas Giant - Gold/Brown)
    {
        id: 5,
        name: "Golden Giant",
        grad: `<stop stop-color="#FCD34D" /><stop offset="1" stop-color="#B45309" />`,
        ringColor: "#FEF3C7",
        bodyColor: "#D97706",
        extra: `<path d="M 20 80 Q 100 95 180 80" stroke="#92400E" stroke-width="6" opacity="0.2" fill="none"/><path d="M 20 120 Q 100 135 180 120" stroke="#92400E" stroke-width="6" opacity="0.2" fill="none"/>`
    },
    // 6. VOID STAR (Black Hole style - Monochrome)
    {
        id: 6,
        name: "Void Star",
        grad: `<stop stop-color="#94A3B8" /><stop offset="1" stop-color="#020617" />`,
        ringColor: "#F8FAFC",
        bodyColor: "#475569",
        extra: `<circle cx="100" cy="100" r="22" fill="#000000" /><circle cx="100" cy="100" r="24" stroke="#FFFFFF" stroke-width="1" opacity="0.5"/>`
    },
    // 7. GAIA (Earth-like - Blue/Green)
    {
        id: 7,
        name: "Gaia",
        grad: `<stop stop-color="#4ADE80" /><stop offset="1" stop-color="#1E3A8A" />`,
        ringColor: "#60A5FA",
        bodyColor: "#2563EB",
        extra: `<path d="M60 80 Q 90 110 100 80 T 140 90" stroke="#22C55E" stroke-width="8" opacity="0.5" stroke-linecap="round" fill="none"/>`
    },
    // 8. SOLARIS (Star - Yellow/Orange)
    {
        id: 8,
        name: "Solaris",
        grad: `<stop stop-color="#FEF08A" /><stop offset="1" stop-color="#EA580C" />`,
        ringColor: "#FDE047",
        bodyColor: "#F97316",
        extra: `<circle cx="100" cy="100" r="42" fill="none" stroke="#FDE047" stroke-width="2" stroke-dasharray="4 4"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/></circle>`
    },
    // 9. QUANTUM (Glitch - Red/Cyan)
    {
        id: 9,
        name: "Quantum",
        grad: `<stop stop-color="#FF003C" /><stop offset="1" stop-color="#00F0FF" />`,
        ringColor: "#FCEE0A",
        bodyColor: "#FFFFFF",
        extra: `<rect x="60" y="70" width="80" height="60" fill="#000000" opacity="0.2" rx="4"/>`
    }
];

export const getPlanetStyle = (seed: number): PlanetStyle => {
    return PLANET_STYLES[Math.abs(seed) % PLANET_STYLES.length];
};

export const getPlanetSvg = (seed: number) => {
    const style = getPlanetStyle(seed);
    return `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="pGrad${seed}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(70 70) rotate(0) scale(160)">
                ${style.grad}
            </radialGradient>
            <clipPath id="pClip${seed}">
                <circle cx="100" cy="100" r="50"/>
            </clipPath>
        </defs>
        <ellipse cx="100" cy="100" rx="90" ry="20" stroke="${style.ringColor}" stroke-width="2" fill="none" opacity="0.4" transform="rotate(-15 100 100)" />
        <circle cx="100" cy="100" r="50" fill="url(#pGrad${seed})" stroke="${style.bodyColor}" stroke-width="2"/>
        <g clip-path="url(#pClip${seed})">
            ${style.extra}
        </g>
        <path d="M 10 100 A 90 20 0 0 0 190 100" stroke="${style.ringColor}" stroke-width="3" fill="none" transform="rotate(-15 100 100)" />
        <circle cx="100" cy="100" r="80" stroke="#FCEE0A" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="12s" repeatCount="indefinite"/>
        </circle>
    </svg>`;
};
