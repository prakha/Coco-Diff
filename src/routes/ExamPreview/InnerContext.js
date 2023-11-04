import React from 'react'

export const InnerExamPreviewContext = React.createContext()

export function useInnerExamPreviewContext() {
    const context = React.useContext(InnerExamPreviewContext);
    if (context === undefined) {
      throw new Error('useInnerExamPreviewContext must be used within an InnerExamPreviewContext.Provider');
    }
    return context;
  }
