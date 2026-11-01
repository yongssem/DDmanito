export default function DdakButton({ children, onClick, variant = 'primary', className = '', disabled = false, ...rest }) {
  return (
    <button type="button" disabled={disabled} {...rest} onClick={onClick}
      className={`ink-button ${variant === 'primary' ? 'ink-primary' : 'ink-secondary'} ${className}`}>
      {children}
    </button>
  )
}
