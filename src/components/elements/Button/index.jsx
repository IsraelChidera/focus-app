import React from 'react'

const index = ({children, className, onClick, ...rest}) => {
  return (
    <button
      className={`rounded-lg py-2 px-8 text-white bg-sidebar hover:bg-secondary text-sm font-semibold ${className}`}    
      onClick={onClick}
      {...rest}
    >
        {children}
    </button>
  )
}

export default index