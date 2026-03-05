/**
 * Illustrated PDF file icon — document page with folded corner + red PDF badge.
 * Matches the visual style of the reference attachment.
 */
export function PdfFileIcon({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const w = Math.round(size * (30 / 38));
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 30 38"
      fill="none"
      className={className}
    >
      {/* Page body */}
      <path
        d="M2.5 0H19L30 11V35.5C30 36.88 28.88 38 27.5 38H2.5C1.12 38 0 36.88 0 35.5V2.5C0 1.12 1.12 0 2.5 0Z"
        fill="#E8EAED"
      />
      {/* Corner fold */}
      <path
        d="M19 0L30 11H21.5C20.12 11 19 9.88 19 8.5V0Z"
        fill="#BDC1C6"
      />
      {/* Red PDF badge */}
      <rect x="2" y="24" width="21" height="11" rx="2.5" fill="#DC2626" />
      <text
        x="12.5"
        y="33"
        textAnchor="middle"
        fill="white"
        fontSize="7"
        fontWeight="800"
        fontFamily="Inter, Arial, sans-serif"
        letterSpacing="0.6"
      >
        PDF
      </text>
    </svg>
  );
}
