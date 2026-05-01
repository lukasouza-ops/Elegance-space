import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Future routes:
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/services" element={<Services />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/admin" element={<Admin />} />
      */}
    </Routes>
  )
}

export default AppRoutes