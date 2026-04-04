import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Clock, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/admin/course/')({
  component: CourseListComponent,
})

const COURSES = [
  { id: '101', name: "គណិតវិទ្យា (ថ្នាក់ទី ១២A)", teacher: "លោក ហ៊ាន សុខា", time: "08:00 - 09:30" },
  { id: '102', name: "រូបវិទ្យា (ថ្នាក់ទី ១២B)", teacher: "អ្នកគ្រូ ចាន់ នី", time: "09:45 - 11:15" },
];

function CourseListComponent() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">កាលវិភាគបង្រៀនថ្ងៃនេះ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map((course) => (
          <Link 
            key={course.id}
            to="/admin/course/$courseId" 
            params={{ courseId: course.id }}
            className="group block bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <span className="text-xs font-medium text-gray-400">ID: {course.id}</span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">{course.name}</h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock size={14} className="mr-1" />
              <span>{course.time}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-sm font-medium text-gray-600">{course.teacher}</span>
              <div className="text-blue-600 flex items-center text-sm font-semibold">
                ស្រង់វត្តមាន <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}