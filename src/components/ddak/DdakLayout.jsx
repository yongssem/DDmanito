import AppTools from '../AppTools'

export default function DdakLayout({ children }) {
  return (
    <div className="ink-ui min-h-screen flex flex-col">
      {children}
      <AppTools />
    </div>
  )
}
