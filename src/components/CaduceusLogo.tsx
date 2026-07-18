export default function CaduceusLogo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="caduceus-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      <rect
        x="1"
        y="1"
        width="54"
        height="54"
        rx="27"
        fill="url(#caduceus-grad)"
      />

      <rect
        x="1"
        y="1"
        width="54"
        height="54"
        rx="27"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* Wings */}
      <path
        d="M17 22c-1.5-1-4-1.5-5.5-1m5.5 1c1.5-1 4-1.5 5.5-1m-5.5 1v-3m0 3v3"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M39 22c1.5-1 4-1.5 5.5-1m-5.5 1c-1.5-1-4-1.5-5.5-1m5.5 1v-3m0 3v3"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Staff */}
      <line
        x1="28"
        y1="14"
        x2="28"
        y2="42"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Top knob */}
      <circle cx="28" cy="13" r="1.8" fill="white" />

      {/* Intertwined serpent left */}
      <path
        d="M28 18c-3 0-5 2-3 5s4 3 3 6-2 4-1 6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Intertwined serpent right */}
      <path
        d="M28 18c3 0 5 2 3 5s-4 3-3 6 2 4 1 6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Oval frame */}
      <ellipse
        cx="28"
        cy="33"
        rx="10"
        ry="11"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.8"
        fill="none"
      />

      {/* Letter P */}
      <text
        x="28"
        y="37"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        P
      </text>
    </svg>
  );
}
