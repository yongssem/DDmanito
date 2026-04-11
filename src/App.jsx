import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import TeacherSetup from './pages/TeacherSetup'
import Share from './pages/Share'
import StudentReveal from './pages/StudentReveal'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFF5E1',
            color: '#4A4A4A',
            borderRadius: '1rem',
            border: '1px solid #FFD6E0',
            fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherSetup />} />
        <Route path="/share/:encoded" element={<Share />} />
        <Route path="/r/:encoded" element={<StudentReveal />} />
      </Routes>
    </BrowserRouter>
  )
}
