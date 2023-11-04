import React from 'react'

export const ExamAnalysisContext = React.createContext()

export function useExamAnalysisContext() {
    const context = React.useContext(ExamAnalysisContext);
    if (context === undefined) {
      throw new Error('useExamAnalysisContext must be used within an ExamAnalysisContext.Provider');
    }
    return context;
  }
