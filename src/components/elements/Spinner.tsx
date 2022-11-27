import cx from 'classnames';

const SPINNER_SIZES = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  base: 'w-12 h-12',
  lg: 'w-16 h-16',
  '2xl': 'w-24 h-24',
} as const;

export const Spinner = ({
  size,
  color,
  className,
}: {
  size: keyof typeof SPINNER_SIZES;
  color?: string;
  className?: string;
}) => (
  <div
    className={cx(
      className,
      'animate-spin',
      'p-0',
      'border-t-2 border-l-2 rounded-full',
      color ? color : 'text-primary border-primary',
      SPINNER_SIZES?.[size] ? SPINNER_SIZES[size] : SPINNER_SIZES.base
    )}
  />
);
