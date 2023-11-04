import React from 'react'

export const InnerExamViewContext = React.createContext()

export function useInnerExamViewContext() {
    const context = React.useContext(InnerExamViewContext);
    if (context === undefined) {
      throw new Error('useInnerExamViewContext must be used within an InnerExamViewContext.Provider');
    }
    return context;
  }
