// Study Session Types
export interface StudySession {
  id: string;
  subjectId: string;
  activityType: string;
  duration: number; // in minutes
  notes: string;
  timestamp: string;
}

// Goal Types
export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'subject';
  subjectId?: string;
  targetTime?: number; // in minutes
  targetTasks?: number;
  dueDate?: string;
  progress: number; // 0-100
  completed: boolean;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number; // in minutes
  progress: number; // 0-100
  completed: boolean;
}

// Calendar Event Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  type: 'exam' | 'assignment' | 'study' | 'other';
  subjectId?: string;
  allDay: boolean;
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  color: string;
}

// Application State
export interface AppState {
  studySessions: StudySession[];
  goals: Goal[];
  tasks: Task[];
  events: CalendarEvent[];
  subjects: Subject[];
}

// Action Types
export type AppAction =
  | { type: 'ADD_STUDY_SESSION'; payload: StudySession }
  | { type: 'UPDATE_STUDY_SESSION'; payload: StudySession }
  | { type: 'DELETE_STUDY_SESSION'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };