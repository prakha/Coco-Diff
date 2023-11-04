import React from 'react'

export const ExamPreviewContext = React.createContext()

export function useExamPreviewContext() {
    const context = React.useContext(ExamPreviewContext);
    if (context === undefined) {
      throw new Error('useExamPreviewContext must be used within an ExamPreviewContext.Provider');
    }
    return context;
  }
