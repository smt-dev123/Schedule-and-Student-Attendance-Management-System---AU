import React, { useEffect, useState } from 'react'
import { RiMoonClearFill, RiMoonClearLine } from 'react-icons/ri'

const DarkMode = () => {
  const [theme, setThemeState] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (storedTheme) {
      setThemeState(storedTheme)
      applyTheme(storedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark')
      applyTheme('dark')
    } else {
      setThemeState('light')
      applyTheme('light')
    }
  }, [])

  const applyTheme = (theme: 'dark' | 'light') => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    applyTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center text-gray-600 dark:text-white hover:text-black dark:hover:text-gray-300 text-xl"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <RiMoonClearFill /> : <RiMoonClearLine />}
    </button>
  )
}

export default DarkMode
