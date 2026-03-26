import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Send, BookOpen, Calendar, MessageSquare, ChevronRight, Bell } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFaculties } from '@/api/FacultyAPI'
import { getGeneration } from '@/api/GenerationAPI'
import { getNotifications, broadcastNotification } from '@/api/NotificationAPI'
import type { FacultiesType, GenerationsType } from '@/types'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/admin/notification/')({
  component: RouteComponent,
})

type Message = {
  id: number
  title?: string
  message: string
  facultyId: number
  targetGeneration?: number
  createdAt?: string
}

function RouteComponent() {
  const queryClient = useQueryClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch data
  const { data: faculties = [] } = useQuery<FacultiesType[]>({
    queryKey: ['faculties'],
    queryFn: getFaculties
  })

  // getGeneration in GenerationAPI.ts might return academic years
  const { data: generations = [] } = useQuery<GenerationsType[]>({
    queryKey: ['generations'],
    queryFn: getGeneration
  })

  const { data: notifications = [] } = useQuery<Message[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications
  })

  const [selectedYear, setSelectedYear] = useState<number | ''>('')
  const [selectedFaculty, setSelectedFaculty] = useState<number | ''>('')
  const [message, setMessage] = useState('')

  // Set initial selections when data loads
  useEffect(() => {
    if (faculties.length > 0 && selectedFaculty === '') {
      setSelectedFaculty(faculties[0].id || '')
    }
  }, [faculties])

  useEffect(() => {
    if (generations.length > 0 && selectedYear === '') {
      setSelectedYear(generations[0].id || '')
    }
  }, [generations])

  const mutation = useMutation({
    mutationFn: broadcastNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      setMessage('')
      toast.success('Notification sent successfully')
    },
    onError: () => {
      toast.error('Failed to send notification')
    }
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [notifications, selectedFaculty, selectedYear])

  function handleSend() {
    if (!message.trim() || selectedFaculty === '') return
    
    mutation.mutate({
      title: "Announcement",
      message: message,
      facultyId: Number(selectedFaculty),
      targetGeneration: selectedYear ? Number(selectedYear) : undefined,
      priority: "normal"
    })
  }

  const filteredMessages = notifications.filter(
    (m) => m.facultyId === Number(selectedFaculty) && (!selectedYear || m.targetGeneration === Number(selectedYear))
  )

  const selectedFacultyName = faculties.find(f => f.id === Number(selectedFaculty))?.name || 'Loading...'
  const selectedYearName = generations.find(g => g.id === Number(selectedYear))?.name || 'All Years'

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
            Generation
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-sm"
            >
              <option value="">All Years</option>
              {generations.map((gen) => (
                <option key={gen.id} value={gen.id}>{gen.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List of Subjects */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 px-4">Faculties</h3>
          <nav className="space-y-1">
            {faculties.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFaculty(f.id!)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${selectedFaculty === f.id
                  ? 'bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200 dark:border-gray-700'
                  : 'text-slate-500 hover:bg-white dark:hover:bg-gray-800 hover:text-slate-700'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className={selectedFaculty === f.id ? 'text-sky-500' : 'text-slate-400'} />
                  {f.name}
                </div>
                <ChevronRight size={14} className={`transition-transform ${selectedFaculty === f.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-none mb-1">{selectedFacultyName}</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">{selectedYearName}</span>
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
                className={`flex flex-col items-end`}
              >
                <div className={`max-w-2xl px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm bg-sky-600 text-white rounded-tr-none`}>
                  {msg.message}
                </div>
                <div className="mt-2 flex items-center gap-2 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Admin</span>
                  <span className="text-[10px] text-slate-400 opacity-60">/ {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} />
              </div>
              <p className="text-lg font-medium">No messages found</p>
              <p className="text-sm">Start a conversation for {selectedFacultyName}.</p>
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
                disabled={mutation.isPending || faculties.length === 0}
                placeholder={`Post an update to ${selectedFacultyName}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] p-2 resize-none max-h-40 min-h-[50px] outline-none dark:text-white disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || mutation.isPending || faculties.length === 0}
                className="bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:bg-slate-200 dark:disabled:bg-gray-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-sky-600/30"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              This announcement will be visible to all students enrolled in <b>{selectedFacultyName}</b> ({selectedYearName}).
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}