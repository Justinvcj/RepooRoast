import React, { createContext, useContext, useState } from 'react';

type LayoutContextType = {
  isNavbarVisible: boolean;
  setIsNavbarVisible: (v: boolean) => void;
  isFooterVisible: boolean;
  setIsFooterVisible: (v: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ isNavbarVisible, setIsNavbarVisible, isFooterVisible, setIsFooterVisible }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
