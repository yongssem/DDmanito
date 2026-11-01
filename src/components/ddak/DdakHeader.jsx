import { motion } from 'framer-motion'

export default function DdakHeader({ title, subtitle, emoji, delay = 0 }) {
  return (
    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay }} className="ink-header">
      {emoji && <div className="ink-header-symbol" aria-hidden="true">{emoji}</div>}
      {title !== '무무마니또' && <p className="ink-brand">무무마니또</p>}
      <h1>{title}</h1>
      {subtitle && <p className="ink-header-subtitle">{subtitle}</p>}
    </motion.header>
  )
}
