import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  Clock,
  CalendarDays,
  CheckCircle,
  User,
  Loader2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAcademicStore } from '@/stores/useAcademicStore'
import FetchData from '@/components/FetchData'
import { getCourses } from '@/api/CourseAPI'
import { Button, Flex, Text } from '@radix-ui/themes'

export const Route = createFileRoute('/admin/course/')({
  component: CourseListComponent,
})

function CourseListComponent() {
  const { selectedYearId } = useAcademicStore()

  // const { data: apiResponse, isLoading, error } = useQuery({
  //   queryKey: ['courses', selectedYearId],
  //   queryFn: () => getCourses(selectedYearId!),
  //   enabled: !!selectedYearId,
  // })
  // const courses = apiResponse?.data

  // ប្រើប្រាស់ Mock Data បើសិនជា API មិនទាន់មានទិន្នន័យ
  const courses = [
    {
      id: 1,
      name: 'Data Structure and Algorithm',
      code: 'CS101',
      day: 'Monday',
      sessionTime: {
        firstSessionStartTime: '06:00',
        secondSessionEndTime: '07:30',
      },
      teacher: { name: 'សេង ស៊ង់' },
      scheduleId: 101, // សម្រាប់ទៅកាន់ Schedule
      schedule: { classroom: { name: 'ស្រុកកងមាស' } },
    },
  ]
  const isLoading = false
  const error = null

  return (
    <div className="p-4 max-w-7xl mx-auto font-kantumruy">
      <Flex justify="between" mb="4">
        <Text size="5" className="font-bold">
          គ្រប់គ្រងវគ្គសិក្សា
        </Text>
        <Flex gap="2">
          {/* Export */}

          <Button variant="outline" style={{ cursor: 'pointer' }}>
            Export Excel
          </Button>
          <Button variant="outline" style={{ cursor: 'pointer' }}>
            បោះពុម្ភ
          </Button>

          <Button variant="solid" style={{ cursor: 'pointer' }}>
            បង្កើតថ្នាក់រៀន
          </Button>
        </Flex>
      </Flex>
      {/* Header */}

      <FetchData isLoading={isLoading} error={error} data={courses}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="group relative bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 hover:border-b-blue-500"
            >
              {/* Header Card */}
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <BookOpen size={24} />
                </div>
                <BadgeCode code={course.code} />
              </div>

              {/* Course Info */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-1">
                {course.name}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2 text-blue-500" />
                  <span>
                    {course.day} | {course.sessionTime?.firstSessionStartTime} -{' '}
                    {course.sessionTime?.secondSessionEndTime}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User size={16} className="mr-2 text-blue-500" />
                  <span className="truncate">គ្រូ៖ {course.teacher?.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  </div>
                  បន្ទប់៖ {course.schedule?.classroom?.name || 'TBA'}
                </div>
              </div>

              {/* Action Buttons: Schedule & Attendance */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-gray-50">
                <Link
                  to="/admin/course/schedule/$scheduleId"
                  params={{
                    scheduleId: String(course.scheduleId || course.id),
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
                >
                  <CalendarDays size={16} />
                  កាលវិភាគ
                </Link>

                <Link
                  to="/admin/course/attendance/$attendanceId"
                  params={{ attendanceId: String(course.id) }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-200"
                >
                  <CheckCircle size={16} />
                  ស្រង់វត្តមាន
                </Link>
              </div>
            </div>
          ))}
        </div>
      </FetchData>
    </div>
  )
}

// Sub-component សម្រាប់បង្ហាញកូដមុខវិជ្ជា
function BadgeCode({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Code
      </span>
      <span className="text-sm font-mono font-bold text-slate-700 italic">
        {code || 'N/A'}
      </span>
    </div>
  )
}
