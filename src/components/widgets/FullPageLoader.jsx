import React from 'react';
import Spinner from '../elements/Spinner';

const FullPageLoader = ({ label = 'Loading' }) => (
  <div className="flex min-h-[60vh] items-center justify-center text-brand">
    <Spinner className="h-7 w-7" label={label} />
  </div>
);

export default FullPageLoader;
