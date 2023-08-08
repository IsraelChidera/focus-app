import React from 'react'

const index = ({children, className}) => {
  return (
    <div
        className={`${className}`}
    >
        {children}
    </div>
  )
}

export default index