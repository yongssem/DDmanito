import { motion } from 'framer-motion'

// 뚝딱 시리즈 헤더: 파스텔 그라데이션 + 큰 이모지로 첫인상 잡기
// title은 텍스트(default) 또는 logoSrc 이미지로 표시 — 다른 앱은 텍스트 그대로 사용
export default function DdakHeader({ title, subtitle, emoji, delay = 0, logoSrc }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay }}
      className="bg-gradient-to-br from-ddak-pink to-ddak-lavender rounded-b-3xl py-10 px-6 text-center shadow-lg"
    >
      {emoji && <div className="text-5xl mb-3">{emoji}</div>}
      {logoSrc ? (
        <div className="w-full max-w-sm h-28 mx-auto overflow-hidden">
          <img
            src={logoSrc}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        <h1 className="font-ssurround text-3xl text-ddak-text">{title}</h1>
      )}
      {subtitle && (
        <p className="font-pretendard text-sm text-ddak-text opacity-80 mt-2">{subtitle}</p>
      )}
    </motion.header>
  )
}
