import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Send, BookOpen, Calendar, MessageSquare, ChevronRight, Bell } from 'lucide-react'

export const Route = createFileRoute('/admin/notification/')({
  component: RouteComponent,
})

const academicYears = ['2023-2024', '2024-2025', '2025-2026']
const subjects = ['Mathematics', 'Computer Science', 'English', 'Physics', 'Biology', 'Chemistry', 'History']

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
  const scrollRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      subject: 'Mathematics',
      year: '2024-2025',
      content: 'Reminder: Exam next week! Please study Chapter 4 to 6.',
      sender: 'Teacher A',
      time: '08:30 AM',
    },
  ])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, selectedSubject])

  function handleSend() {
    if (!message.trim()) return
    const newMsg: Message = {
      id: Date.now(),
      subject: selectedSubject,
      year: selectedYear,
      content: message,
      sender: 'Admin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    setMessage('')
  }

  const filteredMessages = messages.filter(
    (m) => m.subject === selectedSubject && m.year === selectedYear,
  )

  return (
    <div className="flex h-[calc(100vh-150px)] w-full rounded-lg bg-white dark:bg-gray-950 overflow-hidden text-slate-900 dark:text-slate-100">

      {/* --- Sidebar (Left) --- */}
      <aside className="w-80 flex flex-col border-r border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900">
        <div className="p-6 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-sky-600 p-2 rounded-lg text-white">
              <Bell size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
          </div>

          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 block">
            Academic Year
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-sm"
            >
              {academicYears.map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List of Subjects */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 px-4">Subjects</h3>
          <nav className="space-y-1">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${selectedSubject === s
                  ? 'bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-gray-700'
                  : 'text-slate-500 hover:bg-white dark:hover:bg-gray-800 hover:text-slate-700'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className={selectedSubject === s ? 'text-sky-500' : 'text-slate-400'} />
                  {s}
                </div>
                <ChevronRight size={14} className={`transition-transform ${selectedSubject === s ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* --- Main Content (Right) --- */}
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-950">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-none mb-1">{selectedSubject}</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">{selectedYear} Academic Stream</span>
            </div>
          </div>
        </header>

        {/* Message Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] custom-scrollbar"
        >
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'Admin' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-2xl px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.sender === 'Admin'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                  }`}>
                  {msg.content}
                </div>
                <div className="mt-2 flex items-center gap-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400 opacity-60">/ {msg.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <p className="text-lg font-medium">No messages found</p>
              <p className="text-sm">Start a conversation for {selectedSubject}.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-10 group-focus-within:opacity-12 transition duration-500"></div>
            <div className="relative flex items-end gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Post an update to ${selectedSubject}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] p-2 resize-none max-h-40 min-h-[50px] outline-none dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:bg-slate-200 dark:disabled:bg-gray-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-sky-600/30"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              This announcement will be visible to all students enrolled in <b>{selectedSubject}</b> ({selectedYear}).
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}