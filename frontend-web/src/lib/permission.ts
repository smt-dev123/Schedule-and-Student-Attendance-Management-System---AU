const menuPermissions: Record<string, string[]> = {
  dashboard: ['manager', 'staff', 'teacher', 'student'],
  university: ['manager', 'staff'],
  building: ['manager'],
  room: ['manager', 'staff'],
  study: ['manager', 'staff', 'teacher', 'student'],
  faculty: ['manager', 'staff'],
  department: ['manager', 'staff'],
  major: ['manager', 'staff'],
  grade_level: ['manager', 'staff'],
  academic_year: ['manager', 'staff'],
  session_time: ['manager', 'staff'],
  notification: ['manager', 'staff', 'student'],
  teacher: ['manager', 'staff'],
  student: ['manager', 'staff', 'teacher'],
  classes: ['manager', 'staff', 'teacher', 'student'],
  course: ['manager', 'staff', 'teacher', 'student'],
  setting: ['manager', 'staff', 'teacher', 'student'],
}

export default menuPermissions
