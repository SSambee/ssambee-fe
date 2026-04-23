function CheckCircleIcon() {
  return (
    <svg
      className="w-4 h-4 text-green-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const BADGES = ["언제든 해지 가능", "7일 이내 미사용 환불"];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-400">
      {BADGES.map((label) => (
        <span key={label} className="flex items-center gap-1.5">
          <CheckCircleIcon />
          {label}
        </span>
      ))}
    </div>
  );
}
