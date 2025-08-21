import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

import '@schedule-x/theme-default/dist/index.css'

export const Route = createFileRoute('/admin/schedule/')({
  component: RouteComponent,
})

function RouteComponent() {
  const eventsService = useState(() => createEventsServicePlugin())[0]

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    dayBoundaries: {
      start: '07:00',
      end: '22:00',
    },
    weekOptions: {
      gridHeight: 850,
    },
    events: [
      {
        id: 1,
        title: 'Study',
        start: '2025-08-19 18:00',
        end: '2025-08-19 21:15',
      },
      {
        id: 2,
        title: 'Ski trip',
        start: '2025-08-20 13:00',
        end: '2025-08-20 17:00',
      },
      {
        id: 3,
        title: 'date',
        description: 'AAAAAAA',
        start: '2025-08-21 13:00',
        end: '2025-08-21 17:00',
      },
    ],
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
  })

  useEffect(() => {
    // get all events
    eventsService.getAll()
  }, [])

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-gray-100">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
