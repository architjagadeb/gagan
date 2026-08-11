import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="animate-page-in flex-1">
        <Outlet />
      </div>
    </div>
  )
}
