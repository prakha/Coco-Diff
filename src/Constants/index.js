export const STATUS = {
  SUCCESS: "SUCCESS",
  NOT_STARTED: "NOT_STARTED",
  FETCHING: "FETCHING",
  FAILED: "FAILED",
};

export const QUESTION_COLOR = {
  "total-questions": "#5499C7",
  "not-viewed-yet": "gray.400",
  "not-attempted": "brand.red",
  attempted: "brand.green",
  reviewed: "brand.blue",
  "attempted-reviewed": "accent.400",
};

export const QUESTION_RESPONSE_COLOR = {
  correct: "brand.green",
  incorrect: "brand.red",
  "not-marked": "gray.400",
};

export const CONTENT_TYPE = {
  TEXT: "BookContent",
  // PDF: 'PDF',
  VIDEO: "Video",
  AUDIO: "Audio",
  DOCUMENT: "Document",
};

export const OBJ_CONTENT_TYPE = {
  BookContent: "texts",
  // PDF: 'PDF',
  Video: "videos",
  Audio: "audios",
  Document: "documents",
};

export const FILE_TYPE = {
  texts: "BookContent",
  videos: "Video",
  audios: "Audio",
  documents: "Document",
};

export const TEST_STATE = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  NOT_STARTED: "not-started",
};
