import React, { createContext, ReactNode, useContext } from 'react';
import { RootStore } from '@app/stores/rootStore';

// Create the RootStore context
interface StoreContextProps {
  rootStore: RootStore;
}

export const StoreContext = createContext<StoreContextProps | undefined>(
  undefined
);

// Store provider component
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  // Create a single instance of the root store
  const rootStore = React.useMemo(() => new RootStore(), []);

  return (
    <StoreContext.Provider value={{ rootStore }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook to use the store in components
export const useStore = (): StoreContextProps => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
