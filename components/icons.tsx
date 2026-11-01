type P = { size?: number; className?: string };
const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const FileIcon = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </svg>
);
export const UploadIcon = ({ size = 44, className }: P) => (
  <svg {...base(size)} strokeWidth={1.6} className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M12 17v-6M9 14l3-3 3 3" />
  </svg>
);
export const PrintIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M6 9V3h12v6" />
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <path d="M7 14h10v7H7z" />
  </svg>
);
export const DownloadIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);
export const LockIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
export const WarnIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
export const GripIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <circle cx="9" cy="6" r="1" />
    <circle cx="15" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="18" r="1" />
  </svg>
);
export const SortNameIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M3 10l3-7 3 7M4 8h4" />
    <path d="M3 14h6l-6 7h6" />
    <path d="M17 4v16M13 16l4 4 4-4" />
  </svg>
);
export const CalendarIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
    <path d="M8 15h2M14 15h2M8 18h2" />
  </svg>
);
export const SwapIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M7 4v16M3 16l4 4 4-4" />
    <path d="M17 20V4M13 8l4-4 4 4" />
  </svg>
);
export const LayersIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="m12 2 10 5-10 5L2 7z" />
    <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
  </svg>
);
export const CopiesIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="8" y="8" width="13" height="13" rx="2" />
    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
  </svg>
);
export const CheckIcon = ({ size = 14 }: P) => (
  <svg {...base(size)} strokeWidth={2.6}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export const SunIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const MoonIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
