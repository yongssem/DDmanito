export default function DdakLayout({ children }) {
  return (
    <div className="ink-ui min-h-screen flex flex-col">
      {children}
      <footer className="ink-footer">
        © 2026 <a href="https://mumuclass.kr">무궁무진클래스</a> · 용쌤
      </footer>
    </div>
  )
}
