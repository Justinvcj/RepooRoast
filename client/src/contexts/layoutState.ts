import { createContext, useContext } from 'react';

export type LayoutContextType = {
  isNavbarVisible: boolean;
  setIsNavbarVisible: (v: boolean) => void;
  isFooterVisible: boolean;
  setIsFooterVisible: (v: boolean) => void;
};

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
