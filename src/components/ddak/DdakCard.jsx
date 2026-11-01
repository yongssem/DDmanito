import { motion } from 'framer-motion'

export default function DdakCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay }}
      className={`ink-card ${className}`}>
      {children}
    </motion.div>
  )
}
