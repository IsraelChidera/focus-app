import React from 'react'

const index = ({children, className, ...rest}) => {
  return (
    <p
        className={`${className}`}
        {...rest}
    >
        {children}
    </p>
  )
}

export default index