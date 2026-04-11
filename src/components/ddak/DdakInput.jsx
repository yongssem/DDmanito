import { forwardRef } from 'react'

// 뚝딱 시리즈 공통 입력 — cream/pink ring 스타일 한 곳에서 관리
const baseClass =
  'w-full rounded-2xl bg-ddak-cream border border-ddak-pink/40 px-5 py-4 ' +
  'text-ddak-text placeholder:text-ddak-text/40 outline-none ' +
  'focus:ring-4 focus:ring-ddak-pink/40 transition'

// forwardRef + ...rest 패턴으로 onKeyDown, inputMode, maxLength 등 표준 input prop 자동 전달
const DdakInput = forwardRef(function DdakInput(
  { type = 'text', rows = 6, className = '', ...rest },
  ref
) {
  if (type === 'textarea') {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClass} resize-none leading-relaxed ${className}`}
        {...rest}
      />
    )
  }

  return (
    <input
      ref={ref}
      type={type}
      className={`${baseClass} ${className}`}
      {...rest}
    />
  )
})

export default DdakInput
