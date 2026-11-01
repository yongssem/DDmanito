import AppTools from '../AppTools'

export default function DdakLayout({ children }) {
  return (
    <div className="ink-ui min-h-screen flex flex-col">
      {children}
      <AppTools />
      <footer className="ink-footer">
        <a href="https://mumuclass.kr">무궁무진 클래스 X 바이브용샘</a>
        <p className="mt-2">© 2026 무궁무진클래스 · 용쌤</p>
      </footer>
    </div>
  )
}
