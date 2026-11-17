import React, { useState } from 'react';
import { LayoutContext } from './layoutState';

export const LayoutProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ isNavbarVisible, setIsNavbarVisible, isFooterVisible, setIsFooterVisible }}>
      {children}
    </LayoutContext.Provider>
  );
};
