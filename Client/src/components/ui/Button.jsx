import clsx from "clsx";
import { Loader2 } from "lucide-react";

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover disabled:bg-primary/60',
  secondary: 'bg-white text-ink border border-slate-200 hover:bg-surface disabled:opacity-60',
  danger: 'bg-danger text-white hover:bg-danger/90 disabled:bg-danger/60',
  ghost: 'bg-transparent text-muted hover:bg-surface disabled:opacity-60',
};

const Button = ({
    children,
    className,
    disabled,
    isLoading,
    type = 'button',
    variant = 'primary',
    ...props
}) => {
  return (
    <button
        type={type}
        disabled={disabled || isLoading}
        className={clsx(
            'inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5',
            'text-sm font-medium transition-colors',
            'disabled:cursor-not-allowed',
            variants[variant],
            className
        )}
        {...props}
    >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
    </button>
  )
}

export default Button