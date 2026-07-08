import clsx from 'clsx';

const Input = ({ className, label, error, ...props}) => {
  return (
    <div className='flex flex-col gap-1.5'>
        {label && (
            <label className='text-sm font-medium text-ink'>
                {label}
            </label>
        )}
        <input 
            className={clsx(
                'rounded-card border px-3.5 py-2.5 text-sm text-ink placeholder:text-subtle',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                error ? 'border-danger' : 'border-slate-200',
                className
            )}
            {...props}
        />
        {error && (
            <p className='text-xs text-danger'>
                {error}
            </p>
        )}
    </div>
  )
}

export default Input