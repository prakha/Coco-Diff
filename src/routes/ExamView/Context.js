import React from 'react'

export const ExamViewContext = React.createContext()

export function useExamViewContext() {
    const context = React.useContext(ExamViewContext);
    if (context === undefined) {
      throw new Error('useExamViewContext must be used within an ExamViewContext.Provider');
    }
    return context;
  }
