import React from 'react'


export const TestGroundContext = React.createContext()

export function useTestContext() {
    const context = React.useContext(TestGroundContext);
    if (context === undefined) {
      throw new Error('useTestContext must be used within an TestGroundProvider');
    }
    return context;
  }
