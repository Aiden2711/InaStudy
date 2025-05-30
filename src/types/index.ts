// Update the CalendarEvent interface to include customColor
export interface CalendarEvent {
  // ... existing fields ...
  customColor?: string;
}

// Add NotificationSetting type
export interface NotificationSetting {
  id: string;
  subjectId: string;
  reminderTime: number;
  enabled: boolean;
}