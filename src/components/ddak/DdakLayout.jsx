// 뚝딱 시리즈 페이지 공통 셸: 배경 + 세로 flex + 필수 푸터를 한 곳에서 책임짐
export default function DdakLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-ddak-cream text-ddak-text">
      {children}
      <footer className="text-center text-sm text-gray-400 py-6">
        © 2026 <a href="https://mumuclass.kr" className="hover:text-pink-400">무궁무진클래스</a> · 용쌤
      </footer>
    </div>
  )
}
