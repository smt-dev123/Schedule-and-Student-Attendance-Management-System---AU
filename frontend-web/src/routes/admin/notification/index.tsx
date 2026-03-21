import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@radix-ui/themes'

export const Route = createFileRoute('/admin/notification/')({
  component: RouteComponent,
})

const academicYears = ['2023-2024', '2024-2025', '2025-2026']
const subjects = ['Mathematics', 'Computer Science', 'English', 'Physics']

type Message = {
  id: number
  subject: string
  year: string
  content: string
  sender: string
  time: string
}

function RouteComponent() {
  const [selectedYear, setSelectedYear] = useState(academicYears[0])
  const [selectedSubject, setSelectedSubject] = useState(subjects[0])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      subject: 'Mathematics',
      year: '2024-2025',
      content: 'Reminder: Exam next week!',
      sender: 'Teacher A',
      time: '2025-11-10 08:30',
    },
    {
      id: 2,
      subject: 'Computer Science',
      year: '2024-2025',
      content: 'Submit your final project by Friday.',
      sender: 'Teacher B',
      time: '2025-11-09 15:45',
    },
  ])

  function handleSend() {
    if (!message.trim()) return
    const newMsg: Message = {
      id: Date.now(),
      subject: selectedSubject,
      year: selectedYear,
      content: message,
      sender: 'Admin',
      time: new Date().toLocaleString(),
    }
    setMessages((prev) => [...prev, newMsg])
    setMessage('')
  }

  const filteredMessages = messages.filter(
    (m) => m.subject === selectedSubject && m.year === selectedYear,
  )

  return (
    <div className="grid grid-cols-3 h-[calc(100vh-6rem-3.25rem)] bg-white dark:bg-gray-900 rounded-md shadow">
      {/* Left panel */}
      <aside className="col-span-1 border-r dark:border-gray-800 p-4 flex flex-col">
        {/* Academic Year */}
        <div>
          <label className="text-sm text-slate-500">Academic Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full mt-1 border rounded-md px-3 py-2 dark:bg-slate-800 dark:border-slate-700"
          >
            {academicYears.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Subject List */}
        <div className="mt-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent dark:scrollbar-thumb-slate-600 pr-1">
          <h3 className="text-md font-semibold mb-2">Subjects</h3>
          <ul className="space-y-2">
            {subjects.map((s) => (
              <li
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedSubject === s
                    ? 'bg-sky-100 dark:bg-slate-800 text-sky-700'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right panel */}
      <section className="col-span-2 p-6 flex flex-col">
        <div className="flex items-center justify-between border-b pb-2 mb-3">
          <div>
            <h2 className="text-lg font-semibold">{selectedSubject}</h2>
            <p className="text-sm text-slate-500">{selectedYear}</p>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent dark:scrollbar-thumb-slate-600">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg shadow-sm ${
                  msg.sender === 'Admin'
                    ? 'bg-sky-100 dark:bg-sky-900 text-right ml-auto max-w-[75%]'
                    : 'bg-white dark:bg-slate-700 max-w-[75%]'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {msg.sender} • {msg.time}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center mt-10">
              No previous messages
            </p>
          )}
        </div>

        {/* Message Input */}
        <div className="mt-4 border-t pt-4 flex items-center gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-md p-3 resize-none h-20 dark:bg-slate-800 dark:border-slate-700"
          />
          <Button
            onClick={handleSend}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
          >
            Send
          </Button>
        </div>
      </section>
    </div>
  )
}
