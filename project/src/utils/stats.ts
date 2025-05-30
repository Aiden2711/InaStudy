import { StudySession, Goal, Task, Subject } from '../types';

/**
 * Calculate total study time in minutes
 */
export const calculateTotalStudyTime = (sessions: StudySession[]): number => {
  return sessions.reduce((total, session) => total + session.duration, 0);
};

/**
 * Get study time grouped by subject
 */
export const getStudyTimeBySubject = (
  sessions: StudySession[],
  subjects: Subject[]
): Array<{ subject: string; minutes: number; color: string }> => {
  // Group sessions by subject
  const timeBySubjectId: Record<string, number> = {};
  
  sessions.forEach(session => {
    if (!timeBySubjectId[session.subjectId]) {
      timeBySubjectId[session.subjectId] = 0;
    }
    timeBySubjectId[session.subjectId] += session.duration;
  });
  
  // Convert to array with subject names and colors
  const result = Object.entries(timeBySubjectId).map(([subjectId, minutes]) => {
    const subject = subjects.find(s => s.id === subjectId);
    return {
      subject: subject ? subject.name : 'Unknown',
      minutes,
      color: subject ? subject.color : '#CBD5E1',
    };
  });
  
  // Sort by study time (descending)
  return result.sort((a, b) => b.minutes - a.minutes);
};

/**
 * Get study time grouped by day of week
 */
export const getStudyTimeByDay = (
  sessions: StudySession[]
): Array<{ day: string; minutes: number }> => {
  // Initialize days of the week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeByDay: Record<string, number> = {};
  
  // Initialize all days with 0 minutes
  days.forEach(day => {
    timeByDay[day] = 0;
  });
  
  // Group sessions by day
  sessions.forEach(session => {
    const date = new Date(session.timestamp);
    const day = days[date.getDay()];
    timeByDay[day] += session.duration;
  });
  
  // Convert to array
  return days.map(day => ({
    day,
    minutes: timeByDay[day],
  }));
};

/**
 * Calculate goal progress based on study sessions
 */
export const calculateGoalProgress = (goal: Goal, sessions: StudySession[]): number => {
  if (goal.completed) return 100;
  
  // Filter relevant sessions based on goal type
  const relevantSessions = sessions.filter(session => {
    const sessionDate = new Date(session.timestamp);
    const today = new Date();
    
    // For daily goals, only consider sessions from today
    if (goal.type === 'daily') {
      const sessionDay = new Date(sessionDate);
      sessionDay.setHours(0, 0, 0, 0);
      
      const todayDay = new Date(today);
      todayDay.setHours(0, 0, 0, 0);
      
      return sessionDay.getTime() === todayDay.getTime();
    }
    
    // For weekly goals, consider sessions from this week (Sunday to Saturday)
    if (goal.type === 'weekly') {
      const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      
      return sessionDate >= startOfWeek;
    }
    
    // For subject goals, filter by subject and due date if available
    if (goal.type === 'subject' && goal.subjectId) {
      if (session.subjectId !== goal.subjectId) {
        return false;
      }
      
      if (goal.dueDate) {
        const dueDate = new Date(goal.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        return sessionDate <= dueDate;
      }
      
      return true;
    }
    
    return false;
  });
  
  // Calculate progress based on goal type
  if (goal.targetTime && goal.targetTime > 0) {
    const totalTime = calculateTotalStudyTime(relevantSessions);
    const progress = Math.min(100, Math.round((totalTime / goal.targetTime) * 100));
    return progress;
  }
  
  return goal.progress || 0;
};

/**
 * Calculate task completion rate
 */
export const getTaskCompletionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.completed).length;
  return (completedTasks / tasks.length) * 100;
};