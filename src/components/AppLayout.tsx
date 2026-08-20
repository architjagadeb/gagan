import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    document.documentElement.classList.toggle('landing-lock', isLanding)
    return () => {
      document.documentElement.classList.remove('landing-lock')
    }
  }, [isLanding])

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className={isLanding ? 'flex-1' : 'animate-page-in flex-1'}>
        <Outlet />
      </div>
    </div>
  )
}
