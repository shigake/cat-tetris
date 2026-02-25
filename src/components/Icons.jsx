import React from 'react';

const D = { size: 24, className: '' };

export function SwordsIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 3l6 6m0 0l-3.5 3.5M11 9l3.5-3.5M19 3l-6 6m0 0l3.5 3.5M13 9l-3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 15.5L3 20l1 1 4.5-4.5M16.5 15.5L21 20l-1 1-4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BookIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4.5A2.5 2.5 0 016.5 2H20v16H6.5A2.5 2.5 0 004 20.5v-16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6.5 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 18v2.5A2.5 2.5 0 006.5 23H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 7h8M8 11h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PaletteIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.54-1.36-.33-.36-.46-.85-.46-1.34 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C23 6.07 18.03 2 12 2z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor"/>
      <circle cx="10.5" cy="7.5" r="1.5" fill="currentColor"/>
      <circle cx="15.5" cy="7.5" r="1.5" fill="currentColor"/>
      <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function BrainIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2a5 5 0 00-4.78 3.53A4 4 0 004 9.5a4 4 0 001.17 2.83A5 5 0 004 16a5 5 0 004.33 4.95A3 3 0 0012 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 2a5 5 0 014.78 3.53A4 4 0 0120 9.5a4 4 0 01-1.17 2.83A5 5 0 0120 16a5 5 0 01-4.33 4.95A3 3 0 0112 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3"/>
    </svg>
  );
}

export function ShopBagIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ClipboardIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 1h6v4H9V1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function TrophyIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 2h8v9a4 4 0 01-8 0V2z" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 4H5a1 1 0 00-1 1v1a4 4 0 004 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 4h3a1 1 0 011 1v1a4 4 0 01-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 15v3M8 21h8M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function GearIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SoundOnIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SoundOffIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function CloseIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export function CheckIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function EditIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BackIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  );
}

export function ArrowLeftIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArrowDownIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ArrowRightIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RotateIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 15a9 9 0 105.64-12.36L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function HardDropIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3v12M7 11l5 5 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 20h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export function HoldIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function MedalBronzeIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="14" r="7" stroke="#CD7F32" strokeWidth="2"/>
      <path d="M12 7V2M9 2h6" stroke="#CD7F32" strokeWidth="2" strokeLinecap="round"/>
      <text x="12" y="17" textAnchor="middle" fill="#CD7F32" fontSize="8" fontWeight="bold" fontFamily="sans-serif">3</text>
    </svg>
  );
}

export function MedalSilverIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="14" r="7" stroke="#C0C0C0" strokeWidth="2"/>
      <path d="M12 7V2M9 2h6" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round"/>
      <text x="12" y="17" textAnchor="middle" fill="#C0C0C0" fontSize="8" fontWeight="bold" fontFamily="sans-serif">2</text>
    </svg>
  );
}

export function MedalGoldIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="14" r="7" stroke="#FFD700" strokeWidth="2"/>
      <path d="M12 7V2M9 2h6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
      <text x="12" y="17" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold" fontFamily="sans-serif">1</text>
    </svg>
  );
}

export function MedalPlatinumIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2.5 5.5L20 8.5l-4 4 1 5.5-5-2.5-5 2.5 1-5.5-4-4 5.5-1L12 2z" stroke="#67E8F9" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

export function CoinIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Cat ears */}
      <path d="M6.5 8L8.5 3L10.5 8" fill="currentColor" opacity="0.85"/>
      <path d="M13.5 8L15.5 3L17.5 8" fill="currentColor" opacity="0.85"/>
      {/* Coin body */}
      <circle cx="12" cy="14" r="8.5" stroke="currentColor" strokeWidth="2"/>
      {/* $ sign */}
      <path d="M12 9v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9.5 12c0-1.1 1.12-2 2.5-2s2.5.9 2.5 2-1.12 2-2.5 2-2.5.9-2.5 2 1.12 2 2.5 2 2.5-.9 2.5-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export function StarIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

export function BadgeIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M8.5 15l-1.5 7 5-2.5 5 2.5-1.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CelebrationIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 20l5-16 4 8 8-4-17 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M15 4l1 2M19 8l2 1M17 2v2M21 6h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SuccessCircleIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ErrorCircleIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function WarningIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 9v4M12 16v1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export function InfoCircleIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8v0M12 12v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export function GamepadIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 11h4M8 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="10" r="1" fill="currentColor"/>
      <circle cx="18" cy="12" r="1" fill="currentColor"/>
      <path d="M2 10a4 4 0 014-4h12a4 4 0 014 4v0a8 8 0 01-2.34 5.66L17 18.34a2 2 0 01-1.41.59h-0.18a2 2 0 01-1.41-.59l-1.41-1.41a2 2 0 00-1.41-.59h-0.36a2 2 0 00-1.41.59L8 18.34A2 2 0 016.59 18.93h-0.18A2 2 0 015 18.34l-2.66-2.68A8 8 0 012 10z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function RobotIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2v4M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
      <path d="M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M1 12h2M21 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function FaceHappyIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
      <path d="M8 14s1.5 3 4 3 4-3 4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function FaceNeutralIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
      <path d="M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function FaceDevilIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="13" r="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="11" r="1" fill="currentColor"/>
      <circle cx="15" cy="11" r="1" fill="currentColor"/>
      <path d="M9 16s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 6l3 3M19 6l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function FaceGeniusIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
      <path d="M9 15s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14.5 3l1 2.5M17 4.5l-.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function GameModeIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function SprintIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M13 2l-2 8h6l-2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TimerIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 9v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 2h4M12 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function ZenIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12s1.5 3 4 3 4-3 4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 9h0M15 9h0" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export function SkullIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C7 2 3 6 3 11c0 3.17 1.66 5.95 4 7.45V20a1 1 0 001 1h8a1 1 0 001-1v-1.55c2.34-1.5 4-4.28 4-7.45 0-5-4-9-9-9z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="11" r="2" fill="currentColor"/>
      <circle cx="15" cy="11" r="2" fill="currentColor"/>
      <path d="M10 21v1M14 21v1M12 21v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function TargetIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );
}

export function MirrorIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
      <rect x="3" y="6" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="15" y="6" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function ChainIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function BombIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="14" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 7l2-3M15 5l3 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function SpiralIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 12m-2 0a2 2 0 104 0 4 4 0 01-8 0 6 6 0 0112 0 8 8 0 01-16 0 10 10 0 0120 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function ShieldIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l8 4v6c0 5.25-3.44 9.14-8 10.5C7.44 21.14 4 17.25 4 12V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

export function GlobeIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

export function SadCatIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8l2-6h1l1 4h8l1-4h1l2 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4 8a8 8 0 0016 0" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
      <path d="M10 14s0.8-1 2-1 2 1 2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function HappyCatIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8l2-6h1l1 4h8l1-4h1l2 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4 8a8 8 0 0016 0" stroke="currentColor" strokeWidth="2"/>
      <path d="M8.5 10.5l1-.5 1 .5M14.5 10.5l-1-.5-1 .5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 14s0.8 1 2 1 2-1 2-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function HeartCatIcon({ size = D.size, className = D.className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 8l2-6h1l1 4h8l1-4h1l2 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M4 8a8 8 0 0016 0" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 10.5c-.3-.5-.8-.5-1 0s.5 1.3 1 1.7c.5-.4 1.2-1 1-1.7-.2-.5-.7-.5-1 0z" fill="currentColor"/>
      <path d="M15 10.5c-.3-.5-.8-.5-1 0s.5 1.3 1 1.7c.5-.4 1.2-1 1-1.7-.2-.5-.7-.5-1 0z" fill="currentColor"/>
      <path d="M10 14s0.8 1 2 1 2-1 2-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export const MEDAL_ICONS = {
  bronze: MedalBronzeIcon,
  silver: MedalSilverIcon,
  gold: MedalGoldIcon,
  platinum: MedalPlatinumIcon,
};

export const DIFFICULTY_ICONS = {
  easy: FaceHappyIcon,
  normal: FaceNeutralIcon,
  hard: FaceDevilIcon,
  expert: FaceGeniusIcon,
};

export const GAME_MODE_ICONS = {
  marathon: GameModeIcon,
  sprint: SprintIcon,
  timed: TimerIcon,
  zen: ZenIcon,
  survival: SkullIcon,
};

export const CREATOR_TEMPLATE_ICONS = [
  ShieldIcon,
  TargetIcon,
  MirrorIcon,
  ChainIcon,
  BombIcon,
  SpiralIcon,
];
