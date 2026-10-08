import React from 'react';

interface RealisticAirplaneProps {
  direction: 'left' | 'right';
  scale?: number;
  showContrail?: boolean;
  contrailLength?: number;
  altitudeLabel?: string;
  flightCode?: string;
}

export const RealisticAirplane: React.FC<RealisticAirplaneProps> = ({
  direction,
  scale = 1,
  showContrail = true,
  contrailLength = 160,
  flightCode,
}) => {
  const isRight = direction === 'right';

  return (
    <div
      className={`inline-flex items-center pointer-events-none select-none ${
        isRight ? 'flex-row' : 'flex-row-reverse'
      }`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Contrail (Exhaust Vapor Trail) - trailing behind the engines */}
      {showContrail && (
        <div
          className={`relative overflow-visible shrink-0 ${
            isRight ? '-mr-2.5' : '-ml-2.5'
          }`}
          style={{ width: `${contrailLength}px`, height: '18px' }}
        >
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${contrailLength} 18`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id={`contrail-grad-${direction}`}
                x1={isRight ? '0%' : '100%'}
                y1="0%"
                x2={isRight ? '100%' : '0%'}
                y2="0%"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="35%" stopColor="#BAE6FD" stopOpacity="0.15" />
                <stop offset="70%" stopColor="#E0F2FE" stopOpacity="0.45" />
                <stop offset="92%" stopColor="#FFFFFF" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
              </linearGradient>
              <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.7" />
              </filter>
            </defs>

            {/* Expanding outer vapor plume */}
            {isRight ? (
              <polygon
                points={`0,3 ${contrailLength - 10},7 ${contrailLength - 10},11 0,15`}
                fill={`url(#contrail-grad-${direction})`}
                filter="url(#soft-blur)"
                opacity="0.7"
              />
            ) : (
              <polygon
                points={`10,7 ${contrailLength},3 ${contrailLength},15 10,11`}
                fill={`url(#contrail-grad-${direction})`}
                filter="url(#soft-blur)"
                opacity="0.7"
              />
            )}

            {/* Core dense jet exhaust line */}
            <line
              x1={isRight ? '15' : contrailLength - 15}
              y1="9"
              x2={isRight ? contrailLength : '0'}
              y2="9"
              stroke={`url(#contrail-grad-${direction})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Airplane Silhouette Graphic */}
      <div
        className="relative shrink-0"
        style={{
          // When direction is 'left', flip the airplane so nose points LEFT!
          // When direction is 'right', nose points RIGHT!
          transform: isRight ? 'none' : 'scaleX(-1)',
          transformOrigin: 'center center',
        }}
      >
        <svg
          width="82"
          height="28"
          viewBox="0 0 82 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] overflow-visible"
        >
          <defs>
            {/* Fuselage metallic lighting gradient */}
            <linearGradient id="fuselage-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Wing highlight */}
            <linearGradient id="wing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Engine Cowl */}
            <linearGradient id="engine-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Far Wing (Port/Starboard opposing wing) */}
          <path
            d="M 38 9 L 28 2 L 23 2 L 32 9 Z"
            fill="#94A3B8"
            opacity="0.85"
          />

          {/* Main Fuselage Body (Airliner Profile) */}
          {/* Nose tip is at x=78 (RIGHT), tail is at x=5 (LEFT) */}
          <path
            d="
              M 78 12.5
              C 76 10.5 70 8.5 56 8.5
              L 20 8.5
              L 8 1
              L 3 1
              L 7 8.5
              L 4 10
              C 2 11 2 13 4 13.5
              L 12 14.5
              L 32 15
              L 56 15
              C 70 15 76 14.2 78 12.5
              Z
            "
            fill="url(#fuselage-gradient)"
          />

          {/* Fuselage top specular highlight */}
          <path
            d="M 76 12 C 74 10.5 68 9 56 9 L 20 9 L 8 1.5 L 4.5 1.5 L 7.5 9 L 56 9 C 68 9 74 10.5 76 12 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />

          {/* Horizontal Tailplane (Elevator) */}
          <path
            d="M 12 11 L 3 11 L 1 12.5 L 9 12.5 Z"
            fill="#CBD5E1"
          />

          {/* Near Main Swept Wing */}
          <path
            d="
              M 45 12
              L 25 24
              L 21 24
              L 22 22
              L 34 13.5
              L 41 13
              Z
            "
            fill="url(#wing-gradient)"
          />

          {/* Winglet (Aerodynamic upturned tip) */}
          <path
            d="M 22 22 L 20 19 L 21.5 19 L 23 22 Z"
            fill="#38BDF8"
          />

          {/* Turbofan Jet Engine (Underwing nacelle) */}
          <g>
            {/* Engine pylon strut */}
            <rect x="34" y="13" width="2" height="3" fill="#64748B" />
            {/* Engine nacelle body */}
            <rect x="29" y="15" width="13" height="4.5" rx="2" fill="url(#engine-gradient)" />
            {/* Intake spinner ring (Front of engine facing nose) */}
            <ellipse cx="42" cy="17.25" rx="1" ry="2" fill="#E2E8F0" />
            {/* Exhaust nozzle (Rear of engine) */}
            <ellipse cx="29" cy="17.25" rx="0.8" ry="1.8" fill="#1E293B" />
            {/* Subtle turbine heat glow */}
            <circle cx="28.5" cy="17.25" r="1" fill="#F97316" opacity="0.8" />
          </g>

          {/* Cockpit Windshield Visor (Dark reflective angled glass) */}
          <path
            d="M 72 10.5 L 75 11.8 L 72 12.5 L 68 11 Z"
            fill="#0F172A"
          />
          <path
            d="M 72 10.8 L 74 11.6 L 72 12 Z"
            fill="#38BDF8"
            opacity="0.6"
          />

          {/* Passenger Cabin Windows (Soft warm amber/white glow in night flight) */}
          <g fill="#FEF08A" opacity="0.95">
            <rect x="62" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="58" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="54" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="50" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="46" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="42" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="38" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="34" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="30" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="26" y="10.2" width="1.6" height="1.6" rx="0.5" />
            <rect x="22" y="10.2" width="1.6" height="1.6" rx="0.5" />
          </g>

          {/* Tail Fin Airline Accent Strip */}
          <path
            d="M 6.5 4 L 4 1.5 L 7 1.5 L 9 4 Z"
            fill="#0284C7"
          />

          {/* AVIATION LIGHTING (ICAO Standard Navigation & Anti-Collision Lights) */}
          {/* 1. Tail Strobe (White Xenon flash at vertical stabilizer top) */}
          <circle cx="3.5" cy="1.2" r="1.4" fill="#FFFFFF" className="animate-ping" opacity="0.8" />
          <circle cx="3.5" cy="1.2" r="1" fill="#FFFFFF" />

          {/* 2. Wingtip Navigation Light & Strobe */}
          <circle cx="21" cy="22" r="1.4" fill="#34D399" className="animate-pulse" />
          <circle cx="21" cy="22" r="0.8" fill="#FFFFFF" />

          {/* 3. Anti-collision Red Beacon (Fuselage top) */}
          <circle cx="48" cy="8" r="1.2" fill="#EF4444" className="animate-pulse" />

          {/* 4. Anti-collision Red Beacon (Fuselage belly) */}
          <circle cx="38" cy="15.5" r="1.2" fill="#EF4444" className="animate-pulse" />
        </svg>

        {/* Optional flight callsign label beneath plane */}
        {flightCode && (
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-sky-200/60 uppercase whitespace-nowrap"
            style={{
              transform: isRight ? 'none' : 'scaleX(-1)',
            }}
          >
            {flightCode}
          </div>
        )}
      </div>
    </div>
  );
};
