import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Admin from '../pages/Admin'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      {/* Future routes:
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/services" element={<Services />} />
      <Route path="/schedule" element={<Schedule />} />
      */}
    </Routes>
  )
}

export default AppRoutes