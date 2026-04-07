import { PLATFORM_COLORS } from '../../utils/constants';

export default function PlatformBadge({ platform }) {
  const colors = PLATFORM_COLORS[platform] || PLATFORM_COLORS.Glassdoor;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.hex }} />
      {platform}
    </span>
  );
}
