type BadgeProps = {
  children: string;
  tone?: 'success' | 'warning' | 'info';
};

export function Badge({ children, tone = 'info' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
