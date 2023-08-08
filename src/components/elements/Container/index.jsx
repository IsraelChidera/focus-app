import React from 'react';
import Card from '../Card';

const index = ({children, className}) => {
  return (
    <Card
      className={`mx-auto my-10 w-4/5 ${className}`}
    >
      {children}
    </Card>
  )
}

export default index