import { Avatar, DropdownMenu } from '@radix-ui/themes'
import { Link } from '@tanstack/react-router'
import Language from './ui/Language'
import DarkMode from './ui/DarkMode'
import { useTranslation } from 'react-i18next'
import { Notifications } from './ui/Notifications'
import Expand from './ui/Expand'
import { useSidebarStore } from '@/stores/sidebarStore'
import { RiMenu2Line } from 'react-icons/ri'

const Navbar = () => {
  const { toggleMobileSidebar, toggleDesktopSidebar } = useSidebarStore()

  const { t } = useTranslation()

  // Handle menu button click based on screen size
  const handleMenuClick = () => {
    // Check if we're on mobile or desktop
    const isMobile = window.innerWidth < 768 // md breakpoint

    if (isMobile) {
      toggleMobileSidebar()
    } else {
      toggleDesktopSidebar()
    }
  }

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 px-4 min-h-16 shadow-sm">
      <div className="flex gap-2">
        {/* Single menu button for both mobile and desktop */}
        <button
          onClick={handleMenuClick}
          className="text-2xl text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 hover:text-gray-800 cursor-pointer transition-all"
          aria-label="Toggle menu"
        >
          <RiMenu2Line />
        </button>

        {/* Name */}
        <h2 className="hidden min-[480px]:block font-khmer text-lg font-medium text-gray-800 dark:text-white">
          {t('Navbar.hello')} {', '}
          <b className="font-semibold text-gray-900 dark:text-white">
            លុយ សុមាត្រា
          </b>
        </h2>
      </div>

      <div className="flex gap-4 items-center justify-center">
        {/* Language */}
        <Language />

        {/* Expand */}
        <Expand />

        {/* Dark Mode */}
        <DarkMode />

        {/* Notificatoins */}
        <Notifications />

        {/* User */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger style={{ cursor: 'pointer' }}>
            <Avatar
              size="2"
              src="https://academics-bucket-sj19asxm-prod.s3.ap-southeast-1.amazonaws.com/884dc87f-2613-47fc-83b3-b138abc386df/884dc87f-2613-47fc-83b3-b138abc386df.png"
              fallback="A"
              radius="full"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Link to="/admin/setting">ការកំណត់</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link to="/auth/login">ចាកចេញ</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}

export default Navbar
