import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
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
    toggleDesktopSidebar,
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
        {
          key: 'building',
          label: t('Sidebar.University.building'),
          url: '/admin/building',
        },
        {
          key: 'room',
          label: t('Sidebar.University.room'),
          url: '/admin/room',
        },
      ],
    },
    {
      key: 'study',
      icon: <RiSchoolLine className="text-xl" />,
      label: t('Sidebar.Study.study'),
      children: [
        { key: 'level', label: t('Sidebar.Study.level'), url: '/admin/level' },
        {
          key: 'generation',
          label: t('Sidebar.Study.generation'),
          url: '/admin/generation',
        },
        {
          key: 'faculty',
          label: t('Sidebar.Study.faculty'),
          url: '/admin/faculty',
        },
        { key: 'major', label: t('Sidebar.Study.major'), url: '/admin/major' },
      ],
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
      <Collapsible.Root
        open={isDesktopOpen}
        onOpenChange={toggleDesktopSidebar}
        className="hidden md:block min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 transition-all"
      >
        <div className={`transition-all ${isDesktopOpen ? 'w-64' : 'w-16'}`}>
          {/* === Header === */}
          <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
            <Link to="/admin/dashboard" preload="intent">
              <img
                className={`${isDesktopOpen ? 'w-36 h-auto' : 'w-9 h-9'}`}
                src={
                  isDesktopOpen
                    ? 'https://www.angkor.edu.kh/images/LogoAu3.png'
                    : 'https://academics-bucket-sj19asxm-prod.s3.ap-southeast-1.amazonaws.com/884dc87f-2613-47fc-83b3-b138abc386df/884dc87f-2613-47fc-83b3-b138abc386df.png'
                }
                alt="Angkor University"
              />
            </Link>
          </div>

          {/* === Desktop Nav === */}
          <nav className="flex flex-col gap-1 p-2">
            {menuItems.map((menu) =>
              menu.children ? (
                <Collapsible.Root key={menu.key} className="w-full">
                  <Collapsible.Trigger asChild>
                    <button className="flex items-center justify-between w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <div className="flex items-center gap-2">
                        {menu.icon}
                        {isDesktopOpen && (
                          <span className="line-clamp-1">{menu.label}</span>
                        )}
                      </div>
                      {isDesktopOpen && (
                        <RiArrowDownSLine className="ml-auto" />
                      )}
                    </button>
                  </Collapsible.Trigger>
                  <Collapsible.Content className="ml-6 flex flex-col">
                    {menu.children.map((child) => (
                      <Link
                        key={child.key}
                        to={child.url ?? '#'}
                        preload="intent"
                        className="flex items-center gap-2 p-2 text-sm rounded"
                        activeProps={{
                          className:
                            'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400',
                        }}
                        inactiveProps={{
                          className:
                            'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
                        }}
                      >
                        {isDesktopOpen && (
                          <span className="line-clamp-1">{child.label}</span>
                        )}
                      </Link>
                    ))}
                  </Collapsible.Content>
                </Collapsible.Root>
              ) : (
                <Link
                  key={menu.key}
                  to={menu.url ?? '#'}
                  preload="intent"
                  className="flex items-center gap-2 p-2 rounded"
                  activeProps={{
                    className:
                      'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400',
                  }}
                  inactiveProps={{
                    className:
                      'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
                  }}
                >
                  {menu.icon}
                  {isDesktopOpen && (
                    <span className="line-clamp-1">{menu.label}</span>
                  )}
                </Link>
              ),
            )}
          </nav>
        </div>
      </Collapsible.Root>

      {/* === Mobile Drawer === */}
      <div className="md:hidden">
        <Dialog.Root
          open={actualMobileOpen}
          onOpenChange={actualOnMobileOpenChange}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-0 left-0 h-full w-64 bg-white text-gray-900 dark:bg-gray-900 dark:text-white shadow-lg">
              <VisuallyHidden>
                <Dialog.Title>Mobile menu</Dialog.Title>
                <Dialog.Description>
                  Navigation menu with links.
                </Dialog.Description>
              </VisuallyHidden>

              {/* === Header === */}
              <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
                <Link to="/admin/dashboard" preload="intent">
                  <img
                    className="w-36 h-auto"
                    src="https://www.angkor.edu.kh/images/LogoAu3.png"
                    alt="Angkor University"
                  />
                </Link>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {menuItems.map((menu) =>
                  menu.children ? (
                    <Collapsible.Root key={menu.key} className="w-full">
                      <Collapsible.Trigger asChild>
                        <button className="flex items-center justify-between w-full p-2 hover:bg-gray-800 rounded">
                          <div className="flex items-center gap-2">
                            {menu.icon}
                            <span>{menu.label}</span>
                          </div>
                          <RiArrowRightSLine className="ml-auto" />
                        </button>
                      </Collapsible.Trigger>
                      <Collapsible.Content className="ml-6 flex flex-col">
                        {menu.children.map((child) => (
                          <Link
                            key={child.key}
                            to={child.url ?? '#'}
                            preload="intent"
                            className="flex items-center gap-2 p-2 text-sm rounded"
                            activeProps={{
                              className:
                                'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400',
                            }}
                            inactiveProps={{
                              className:
                                'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
                            }}
                          >
                            <span className="line-clamp-1">{child.label}</span>
                          </Link>
                        ))}
                      </Collapsible.Content>
                    </Collapsible.Root>
                  ) : (
                    <Link
                      key={menu.key}
                      to={menu.url ?? '#'}
                      preload="intent"
                      className="flex items-center gap-2 p-2 rounded"
                      activeProps={{
                        className:
                          'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400',
                      }}
                      inactiveProps={{
                        className:
                          'hover:bg-blue-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
                      }}
                    >
                      {menu.icon}
                      <span>{menu.label}</span>
                    </Link>
                  ),
                )}
              </nav>

              {/* <Dialog.Close asChild>
                <button
                  aria-label="Close menu"
                  className="absolute top-3 right-3 rounded p-1 hover:bg-white/10"
                >
                  ✕
                </button>
              </Dialog.Close> */}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  )
}
