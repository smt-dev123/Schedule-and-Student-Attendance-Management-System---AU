import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  RiDashboardLine,
  RiSettings3Line,
  RiSchoolLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { LiaChalkboardTeacherSolid } from 'react-icons/lia'
import { AiOutlineSchedule } from 'react-icons/ai'
import { PiStudent } from 'react-icons/pi'
import { FaRegUser } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'
import { useSidebarStore } from '@/stores/sidebarStore'

interface MenuItem {
  key: string
  icon?: any
  label: string
  url?: string
  children?: MenuItem[]
}

type SidebarProps = {
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

export default function Sidebar({
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const {
    isDesktopOpen,
    isMobileOpen,
    setMobileSidebar,
  } = useSidebarStore()

  const { t } = useTranslation()

  const actualMobileOpen = mobileOpen !== undefined ? mobileOpen : isMobileOpen
  const actualOnMobileOpenChange = onMobileOpenChange || setMobileSidebar

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <RiDashboardLine className="text-xl" />,
      label: t('Sidebar.dashboard'),
      url: '/admin/dashboard',
    },
    {
      key: 'university',
      icon: <RiSchoolLine className="text-xl" />,
      label: t('Sidebar.University.university'),
      children: [
        { key: 'building', label: t('Sidebar.University.building'), url: '/admin/building' },
        { key: 'room', label: t('Sidebar.University.room'), url: '/admin/room' },
      ],
    },
    {
      key: 'study',
      icon: <RiSchoolLine className="text-xl" />,
      label: t('Sidebar.Study.study'),
      children: [
        { key: 'faculty', label: t('Sidebar.Study.faculty'), url: '/admin/faculty' },
        { key: 'major', label: t('Sidebar.Study.major'), url: '/admin/major' },
        { key: 'department', label: 'តេប៉ាតឺម៉ង់', url: '/admin/department' },
        { key: 'grade_level', label: t('Sidebar.Study.level'), url: '/admin/grade_level' },
        { key: 'generation', label: t('Sidebar.Study.generation'), url: '/admin/generation' },
        { key: 'academic_year', label: 'ឆ្នាំសិក្សា', url: '/admin/academic_year' },
      ],
    },
    {
      key: 'notification',
      icon: <LiaChalkboardTeacherSolid className="text-xl" />,
      label: 'ការជូនដំណឹង',
      url: '/admin/notification',
    },
    {
      key: 'teacher',
      icon: <LiaChalkboardTeacherSolid className="text-xl" />,
      label: t('Sidebar.teacher'),
      url: '/admin/teacher',
    },
    {
      key: 'student',
      icon: <PiStudent className="text-xl" />,
      label: t('Sidebar.student'),
      url: '/admin/student',
    },
    {
      key: 'classes',
      icon: <AiOutlineSchedule className="text-xl" />,
      label: t('Sidebar.class'),
      url: '/admin/classes',
    },
    {
      key: 'user',
      icon: <FaRegUser className="text-md" />,
      label: t('Sidebar.user'),
      url: '/admin/user',
    },
    {
      key: 'setting',
      icon: <RiSettings3Line className="text-xl" />,
      label: t('Sidebar.setting'),
      url: '/admin/setting',
    },
  ]

  return (
    <div className="flex">
      {/* === Desktop Sidebar === */}
      <aside
        className={`hidden md:flex flex-col min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isDesktopOpen ? 'w-64' : 'w-20'
          }`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
          <Link to="/admin/dashboard" preload="intent">
            <img
              className={`${isDesktopOpen ? 'w-36 h-auto' : 'w-9 h-9'}`}
              src={
                isDesktopOpen
                  ? 'https://www.angkor.edu.kh/assets/images/AU-LOGO.png'
                  : 'https://academics-bucket-sj19asxm-prod.s3.ap-southeast-1.amazonaws.com/884dc87f-2613-47fc-83b3-b138abc386df/884dc87f-2613-47fc-83b3-b138abc386df.png'
              }
              alt="Angkor University"
            />
          </Link>
        </div>

        {/* Academic Year Dropdown */}
        {/* {isDesktopOpen && (
          <div className="px-4 py-3">
            <label htmlFor="academic-year" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              {t('Sidebar.Study.academic_year')}
            </label>
            <select
              id="academic-year"
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none transition-all"
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )} */}

        {/* Navigation Content */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((menu) =>
            menu.children ? (
              isDesktopOpen ? (
                <Collapsible.Root key={menu.key} className="group">
                  <Collapsible.Trigger asChild>
                    <button className="flex items-center w-full p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 group-hover:text-blue-600 transition-colors">{menu.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{menu.label}</span>
                      </div>
                      <RiArrowDownSLine className="ml-auto text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </button>
                  </Collapsible.Trigger>
                  <Collapsible.Content className="ml-9 mt-1 flex flex-col gap-1 border-l-2 border-gray-100 dark:border-gray-800 overflow-hidden data-[state=open]:animate-in data-[state=open]:fade-in">
                    {menu.children.map((child) => (
                      <Link
                        key={child.key}
                        to={child.url ?? '#'}
                        className="p-2 text-[13px] pl-4 rounded-r-lg transition-colors"
                        activeProps={{ className: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 font-semibold' }}
                        inactiveProps={{ className: 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white' }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </Collapsible.Content>
                </Collapsible.Root>
              ) : (
                <DropdownMenu.Root key={menu.key}>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center justify-center w-full p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-600 transition-all">
                      {menu.icon}
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      side="right"
                      sideOffset={15}
                      className="z-[100] min-w-[180px] bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-left-2 duration-200"
                    >
                      <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{menu.label}</div>
                      <DropdownMenu.Separator className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                      {menu.children.map((child) => (
                        <DropdownMenu.Item key={child.key} asChild>
                          <Link
                            to={child.url ?? '#'}
                            className="flex items-center px-3 py-2 text-sm rounded-lg outline-none cursor-pointer mb-0.5"
                            activeProps={{ className: 'bg-blue-600 text-white' }}
                            inactiveProps={{ className: 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800' }}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )
            ) : (
              <Link
                key={menu.key}
                to={menu.url ?? '#'}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${!isDesktopOpen ? 'justify-center p-3' : ''}`}
                activeProps={{ className: 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' }}
                inactiveProps={{ className: 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800' }}
              >
                <span className="text-xl">{menu.icon}</span>
                {isDesktopOpen && <span className="text-sm font-medium">{menu.label}</span>}
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* === Mobile Drawer === */}
      <div className="md:hidden">
        <Dialog.Root open={actualMobileOpen} onOpenChange={actualOnMobileOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-51 flex flex-col animate-in slide-in-from-left duration-300">
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
                <img className="w-32" src="https://www.angkor.edu.kh/assets/images/AU-LOGO.png" alt="Logo" />
                <Dialog.Close className="p-2 text-gray-400">✕</Dialog.Close>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {menuItems.map((menu) =>
                  menu.children ? (
                    <Collapsible.Root key={menu.key} className="group">
                      <Collapsible.Trigger asChild>
                        <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{menu.icon}</span>
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{menu.label}</span>
                          </div>
                          <RiArrowRightSLine className="text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-90" />
                        </button>
                      </Collapsible.Trigger>
                      <Collapsible.Content className="ml-9 flex flex-col gap-1 border-l-2 border-gray-100 dark:border-gray-800">
                        {menu.children.map((child) => (
                          <Link
                            key={child.key}
                            to={child.url ?? '#'}
                            onClick={() => actualOnMobileOpenChange(false)}
                            className="p-3 text-sm text-gray-500 hover:text-blue-600"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </Collapsible.Content>
                    </Collapsible.Root>
                  ) : (
                    <Link
                      key={menu.key}
                      to={menu.url ?? '#'}
                      onClick={() => actualOnMobileOpenChange(false)}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      activeProps={{ className: 'bg-blue-600 text-white shadow-lg' }}
                      inactiveProps={{ className: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800' }}
                    >
                      <span className="text-xl">{menu.icon}</span>
                      <span className="font-medium text-sm">{menu.label}</span>
                    </Link>
                  )
                )}
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  )
}