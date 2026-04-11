import { motion } from 'framer-motion'

// 뚝딱 시리즈 공통 버튼: spring 인터랙션 + 둥근 모서리 파스텔
export default function DdakButton({ children, onClick, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-ddak-pink text-white',
    secondary: 'bg-ddak-mint text-ddak-text',
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`font-pretendard font-bold rounded-2xl px-6 py-3 shadow-md ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
