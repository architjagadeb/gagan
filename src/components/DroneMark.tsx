/** Compact quadcopter mark for the planner map flight. */
export function DroneMark() {
  return (
    <g>
      <circle cx="-5.2" cy="-5.2" r="1.7" fill="none" stroke="#0b6e6e" strokeWidth="0.55" />
      <circle cx="5.2" cy="-5.2" r="1.7" fill="none" stroke="#0b6e6e" strokeWidth="0.55" />
      <circle cx="-5.2" cy="5.2" r="1.7" fill="none" stroke="#0b6e6e" strokeWidth="0.55" />
      <circle cx="5.2" cy="5.2" r="1.7" fill="none" stroke="#0b6e6e" strokeWidth="0.55" />
      <path
        d="M-3.2-3.2 L-5.2-5.2 M3.2-3.2 L5.2-5.2 M-3.2 3.2 L-5.2 5.2 M3.2 3.2 L5.2 5.2"
        stroke="#0b6e6e"
        strokeWidth="0.55"
        strokeLinecap="round"
      />
      <rect x="-3.2" y="-2.2" width="6.4" height="4.4" rx="1.4" fill="#0b6e6e" />
      <rect x="-1.6" y="-0.8" width="3.2" height="1.4" rx="0.5" fill="#d8f0ef" />
      <circle cx="0" cy="3.4" r="0.85" fill="#e85d4c" />
    </g>
  )
}
