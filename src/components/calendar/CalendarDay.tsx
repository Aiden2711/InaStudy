// Update the event rendering styles in CalendarDay.tsx
// ... (previous imports and code remain the same)

const eventStyles = {
  text: 'font-bold text-lg text-white',
  background: 'bg-opacity-90',
  spacing: 'ml-2', // Increased spacing between dot and text
};

// Inside the component, update the event rendering:
{visibleEvents.map(event => (
  <div 
    key={event.id}
    onClick={() => !event.isTask && onSelectEvent(event.id)}
    className={`px-2 py-1 rounded text-base truncate ${
      event.isTask ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
    } ${eventStyles.text} ${eventStyles.background}`}
    style={{ 
      backgroundColor: event.customColor || `${getEventColor(event)}E6`,
      borderLeft: `3px solid ${getEventColor(event)}`,
    }}
  >
    {!event.allDay && viewMode !== 'month' && (
      <span className="font-medium mr-1">
        {formatEventTime(event.startTime)}
      </span>
    )}
    
    <span className={event.isTask && event.completed ? 'line-through opacity-70' : ''}>
      {viewMode === 'month' && (
        <span className={`inline-block w-2 h-2 rounded-full ${eventStyles.spacing}`} 
          style={{ backgroundColor: getEventColor(event) }}></span>
      )}
      {viewMode !== 'month' && (
        <span className="text-base text-white mr-1">
          [{getEventTypeLabel(event)}]
        </span>
      )}
      {event.title}
    </span>
  </div>
))}

// ... (rest of the code remains the same)