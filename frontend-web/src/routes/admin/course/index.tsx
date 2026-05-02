import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  Clock,
  CalendarDays,
  CheckCircle,
  User,
  Pencil,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAcademicStore } from '@/stores/useAcademicStore'
import FetchData from '@/components/FetchData'
import { getCourses, deleteCourse } from '@/api/CourseAPI'
import { Flex, Text } from '@radix-ui/themes'
import CourseCreate from './-actions/Create'
import CourseUpdate from './-actions/Update'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CourseDelete from './-actions/Delete'

export const Route = createFileRoute('/admin/course/')({
  component: CourseListComponent,
})

function CourseListComponent() {
  const { selectedYearId } = useAcademicStore()
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  const queryClient = useQueryClient()

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses', selectedYearId],
    queryFn: () => getCourses(selectedYearId!),
    enabled: !!selectedYearId,
  })

  const courses = apiResponse ?? []

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCourse(id),
    onSuccess: () => {
      toast.success('លុបមុខវិជ្ជាជោគជ័យ')
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: () => toast.error('មិនអាចលុបបានទេ'),
  })

  return (
    <>
      <Flex justify="between" mb="4">
        <Text size="5" className="font-bold">
          គ្រប់គ្រងវគ្គសិក្សា
        </Text>
        <Flex gap="2">
          <CourseCreate />
        </Flex>
      </Flex>
      {/* Header */}

      <FetchData isLoading={isLoading} error={error} data={courses}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 hover:border-b-blue-500"
            >
              {/* Header Card */}
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <BookOpen size={24} />
                </div>
                <Flex align="center" gap="3">
                  <BadgeCode code={course.code} />
                  <button
                    className="text-orange-400 hover:text-orange-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      setEditingCourse(course)
                      setIsUpdateOpen(true)
                    }}
                  >
                    <Flex align="center" gap="1">
                      <Pencil size={14} />
                      កែប្រែ
                    </Flex>
                  </button>
                  <CourseDelete data={course} />
                </Flex>
              </div>

              {/* Course Info */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 line-clamp-1">
                {course.name}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-500 dark:text-white">
                  <Clock size={16} className="mr-2 text-blue-500" />
                  <span>
                    {course.day} |{' '}
                    {course.schedule?.sessionTime?.firstSessionStartTime} -{' '}
                    {course.schedule?.sessionTime?.secondSessionEndTime}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-white">
                  <User size={16} className="mr-2 text-blue-500" />
                  <span className="truncate">
                    គ្រូបង្រៀន៖ {course.teacher?.name}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 font-medium dark:text-white">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  </div>
                  បន្ទប់៖ {course.schedule?.classroom?.name || 'TBA'}
                </div>
              </div>

              {/* Action Buttons: Schedule & Attendance */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-gray-50">
                <Link
                  to="/admin/schedule/$scheduleId"
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

      <CourseUpdate
        course={editingCourse}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
      />
    </>
  )
}

function BadgeCode({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-md font-mono font-bold text-slate-700 dark:text-white italic">
        {code || 'N/A'}
      </span>
    </div>
  )
}
