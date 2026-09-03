// Thin single-weight line icons (matches the design system: 1.5px stroke,
// no fill, gold accent) — used in place of OS emoji, which render
// inconsistently across platforms and don't match the brand's visual style.

const base = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function RingsIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="15" r="4.5" />
      <circle cx="15" cy="15" r="4.5" />
      <path d="M12 4l2.5 4h-5L12 4z" />
    </svg>
  );
}

export function LeafIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c0-7.5 5-13 14-13-1 8-6 13-14 13z" />
      <path d="M5 19c2-4 5-7 9-9" />
    </svg>
  );
}

export function ToastIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3l1 9a4 4 0 008 0l1-9" />
      <path d="M12 12v9" />
      <path d="M8.5 21h7" />
    </svg>
  );
}

export function SparkleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 5.7L19 10l-5.2 1.3L12 17l-1.8-5.7L5 10l5.2-1.3L12 3z" />
    </svg>
  );
}
