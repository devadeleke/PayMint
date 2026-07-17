
const Input = ({ type, placeholder, label, icon:Icon, error, ...props}) => {
  return (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-ink">{label}</label>}
        <div className="relative h-10">
            {Icon && (
                <div className="absolute text-subtle left-2 top-1/2 -translate-y-1/2">
                    <Icon className='size-4' />
                </div>
            )}
            <input type={type}
                placeholder={placeholder}
                className={`w-full rounded-sm border pr-3.5 py-2.5 ${Icon ? "pl-8" : 'pl-2'} text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                        ${error ? 'border-danger' : 'border-slate-200'}
                    `}
                {...props}
            />
            {error && (
                <p className="text-xs text-danger">
                    {error}
                </p>
            )}
        </div>
    </div>
  )
}

export default Input