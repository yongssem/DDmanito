import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DdakButton from './ddak/DdakButton'
import { APP_URL } from '../lib/releases'

export default function AppTools() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true)
  const [installHelp, setInstallHelp] = useState(false)
  const [full, setFull] = useState(() => Boolean(document.fullscreenElement))
  const fullSupported = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen)

  useEffect(() => {
    const beforeInstall = (event) => { event.preventDefault(); setInstallPrompt(event) }
    const appInstalled = () => { setInstalled(true); setInstallPrompt(null); setInstallHelp(false) }
    const fullChanged = () => setFull(Boolean(document.fullscreenElement))
    const display = window.matchMedia('(display-mode: standalone)')
    const displayChanged = () => setInstalled(display.matches || navigator.standalone === true)
    window.addEventListener('beforeinstallprompt', beforeInstall)
    window.addEventListener('appinstalled', appInstalled)
    document.addEventListener('fullscreenchange', fullChanged)
    display.addEventListener('change', displayChanged)
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall)
      window.removeEventListener('appinstalled', appInstalled)
      document.removeEventListener('fullscreenchange', fullChanged)
      display.removeEventListener('change', displayChanged)
    }
  }, [])

  async function copyOfficialLink() {
    try { await navigator.clipboard.writeText(APP_URL); toast.success('공식 주소를 복사했어요.') }
    catch { toast.error('복사할 수 없어요. 아래 공식 주소를 직접 복사해주세요.') }
  }

  async function shareApp() {
    if (typeof navigator.share !== 'function') return copyOfficialLink()
    try { await navigator.share({ title: '무무마니또', text: '학교 태블릿으로 시작하는 우리 반 비밀 친구와 매일의 친절 미션', url: APP_URL }) }
    catch (error) { if (error.name !== 'AbortError') await copyOfficialLink() }
  }

  async function installApp() {
    if (!installPrompt) { setInstallHelp((open) => !open); return }
    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      if (choice.outcome === 'accepted') toast.success('기기에서 설치를 완료해주세요.')
    } catch { setInstallHelp(true); toast('아래 기기별 설치 안내를 확인해주세요.') }
    finally { setInstallPrompt(null) }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (fullSupported) await document.documentElement.requestFullscreen()
    } catch { toast.error('이 환경에서 전체화면을 사용할 수 없어요. 일반 브라우저에서 열어주세요.') }
  }

  return <aside className="app-tools print:hidden" aria-label="앱 도구">
    {full && <button type="button" className="ink-button ink-primary fullscreen-exit" onClick={toggleFullscreen}>전체화면 나가기 ✕</button>}
    <div className="flex flex-wrap gap-3 items-center">
      <DdakButton variant="secondary" className="!text-sm" onClick={shareApp}>공유하기</DdakButton>
      <DdakButton variant="secondary" className="!text-sm" onClick={copyOfficialLink}>공식 주소 복사</DdakButton>
      {!installed ? <DdakButton variant="secondary" className="!text-sm" aria-expanded={installHelp} aria-controls="install-help" onClick={installApp}>{installPrompt ? '앱 설치하기' : '설치 안내'}</DdakButton> : <span className="ink-badge">설치된 앱에서 사용 중</span>}
      <DdakButton variant="secondary" className="!text-sm" disabled={!fullSupported && !full} onClick={toggleFullscreen}>{full ? '전체화면 해제' : fullSupported ? '전체화면' : '전체화면 미지원'}</DdakButton>
    </div>
    <p className="text-xs mt-4">공유할 때는 개인 QR 대신 공식 주소를 보내요.</p>
    <label className="sr-only" htmlFor="official-app-url">무무마니또 공식 주소</label>
    <input id="official-app-url" className="ink-field mt-2 !text-xs" readOnly value={APP_URL} onFocus={(e) => e.target.select()} />
    {!fullSupported && <p className="text-xs mt-3">전체화면은 이 브라우저에서 지원하지 않아요. 기기의 브라우저 메뉴를 이용해주세요.</p>}
    {installHelp && <div id="install-help" className="ink-subcard p-4 mt-4 text-sm" role="region" aria-label="기기별 설치 안내">
      <h2 className="text-lg">홈 화면에서 편하게 열기</h2>
      <ul className="list-disc pl-5 space-y-2 mt-3">
        <li>Android Chrome·Edge: 브라우저 메뉴에서 ‘앱 설치’ 또는 ‘홈 화면에 추가’를 찾아주세요.</li>
        <li>iPhone·iPad: Safari에서 공식 주소를 연 뒤 공유 메뉴의 ‘홈 화면에 추가’를 선택해주세요.</li>
        <li>PC Chrome·Edge: 주소창의 설치 아이콘이나 브라우저 메뉴를 이용해주세요.</li>
      </ul>
      <p className="text-xs mt-4">현재 브라우저는 자동 설치 창을 제공하지 않거나 아직 설치 조건을 확인 중이에요. 메뉴에 설치 항목이 없으면 일반 Chrome·Edge·Safari에서 열어주세요.</p>
      <p className="text-xs mt-2">앱을 열 때 인터넷이 필요해요. 설치한 앱과 브라우저의 기록이 분리될 수 있으니 처음 선택한 환경으로 계속 참여해주세요.</p>
    </div>}
  </aside>
}
