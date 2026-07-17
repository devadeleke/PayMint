
const Card = ({ children, ...props}) => {
  return (
    <div className='rounded-md bg-white p-6 shadow-sm sm:p-8' {...props}>
        {children}
    </div>
  )
}

export default Card