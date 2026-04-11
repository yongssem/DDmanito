import { motion } from 'framer-motion'

// 뚝딱 시리즈 공통 카드: 부드러운 등장 + 큰 라운드
export default function DdakCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay }}
      className={`bg-white shadow-lg rounded-3xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}
