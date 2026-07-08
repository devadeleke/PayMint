import clsx from 'clsx';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx('rounded-card bg-white p-6 shadow-card sm:p-8', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card