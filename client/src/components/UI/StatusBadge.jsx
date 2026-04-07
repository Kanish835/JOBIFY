import { STATUS_CONFIG } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['New'];

  return (
    <span className={config.color}>
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}
