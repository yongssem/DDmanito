import { forwardRef } from 'react'

const DdakInput = forwardRef(function DdakInput({ type = 'text', rows = 6, className = '', ...rest }, ref) {
  if (type === 'textarea') {
    return <textarea ref={ref} rows={rows} className={`ink-field resize-none leading-relaxed ${className}`} {...rest} />
  }
  return <input ref={ref} type={type} className={`ink-field ${className}`} {...rest} />
})

export default DdakInput
