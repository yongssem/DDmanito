import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import PixelGuide from '../components/manito/PixelGuide'
import { lastTeacherActivity } from '../lib/activity'
import { MISSIONS } from '../lib/missions'

export default function Home() {
  const navigate = useNavigate()
  const [lastActivity] = useState(lastTeacherActivity)
  const [sample, setSample] = useState(0)
  const examples = [MISSIONS[0], MISSIONS[2], MISSIONS[6]]
  return <DdakLayout>
    <DdakHeader title="무무마니또" subtitle="우리 반에 도착한, 하루 하나의 비밀 임무" emoji="🎒" />
    <main className="landing-main flex-1 max-w-5xl mx-auto w-full px-5 py-8 space-y-7">
      <DdakCard className="landing-hero">
        <div className="hero-copy">
          <span className="ink-badge">학교 태블릿으로도 OK · 회원가입 없이</span>
          <h2 className="hero-title mt-5">오늘, 친구 몰래<br /><span className="text-ddak-accent">친절 한 칸.</span></h2>
          <p className="text-base leading-relaxed mt-5">마니또를 뽑고 끝내지 않아요.<br />무무가 건네는 비밀 임무를 따라<br />우리 반의 다정함을 모아보세요.</p>
          <div className="hero-actions mt-6 space-y-3">
            <DdakButton className="w-full" onClick={() => navigate('/demo')}>🎮 학생 화면 먼저 체험하기</DdakButton>
            <DdakButton variant="secondary" className="w-full" onClick={() => navigate('/teacher')}>선생님 · 우리 반 탐험 만들기 →</DdakButton>
          </div>
          <p className="text-xs mt-4">체험은 예시 이름으로 진행해요. 실제 학생 명단은 필요 없어요.</p>
        </div>
        <div className="hero-world">
          <img src="/images/mumu-village.png" width="1536" height="1024" fetchPriority="high" decoding="async" alt="학교와 우체통, 꽃밭을 오솔길로 잇는 도트 마을. 비밀 친구들이 친절 미션을 하며 탐험해요." />
          <div className="hero-guide-path"><PixelGuide /></div>
          <span className="world-caption ink-badge">무무와 함께 비밀 친구 탐험</span>
        </div>
      </DdakCard>

      <div className="grid grid-cols-3 gap-3">
        {[['💌', '학생별 QR', '한 명에게 한 장씩'], ['📋', '명단 붙여넣기', '엑셀에서 바로'], ['🌟', '오늘의 비밀 임무', '친절 도장 모으기']].map(([emoji, title, desc]) => <div key={title} className="ink-subcard text-center px-2 py-5">
          <p className="text-3xl" aria-hidden="true">{emoji}</p><h3 className="text-sm mt-3">{title}</h3><p className="text-xs mt-2">{desc}</p>
        </div>)}
      </div>

      <DdakCard>
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl">오늘은 어떤 임무가 올까?</h2><span className="ink-badge">하루 하나 · 교실에서 실천</span></div>
        <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="미션 예시 고르기">
          {['👋 인사 작전', '💬 칭찬 퀘스트', '🤝 함께하기'].map((label, index) => <button key={label} type="button" aria-pressed={sample === index} onClick={() => setSample(index)} className={`ink-button !text-sm !px-3 !py-2 ${sample === index ? 'ink-primary' : 'ink-secondary'}`}>{label}</button>)}
        </div>
        <div className="mission-example ink-subcard mt-5 p-5" aria-live="polite">
          <PixelGuide /><div><p className="text-xs text-ddak-accent font-bold">무무가 건네는 미션 예시</p><h3 className="text-xl mt-2">{examples[sample][1]}</h3><p className="text-sm leading-relaxed mt-3">{examples[sample][2]}</p></div>
        </div>
        <p className="text-xs mt-4">앱에서는 임무를 열고 도장만 찍어요. 진짜 모험은 친구 곁에서!</p>
      </DdakCard>

      <DdakCard>
        <h2 className="text-2xl">이렇게 시작해요</h2>
        <ol className="how-to-list grid sm:grid-cols-3 gap-4 mt-5 text-sm">
          <li className="ink-subcard p-4"><span className="ink-badge">01 · 선생님 준비</span><h3 className="text-lg mt-4">명단 붙여넣기</h3><p className="mt-2">학급과 기간을 정하고 엑셀 명단을 붙여넣어요.</p></li>
          <li className="ink-subcard p-4"><span className="ink-badge">02 · 비밀 초대</span><h3 className="text-lg mt-4">개인 QR 나누기</h3><p className="mt-2">학생에게 자기 QR을 한 장씩 줘요. 학교 탭으로도 입장해요.</p></li>
          <li className="ink-subcard p-4"><span className="ink-badge">03 · 학생 탐험</span><h3 className="text-lg mt-4">실천하고 도장!</h3><p className="mt-2">비밀 친구를 확인하고 매일 미션을 실천해요.</p></li>
        </ol>
        <p className="text-sm mt-5">마지막 날에는 감사 인사를 나누며 함께 마무리해요.</p>
      </DdakCard>

      <DdakCard className="ink-tint">
        <h2 className="text-2xl">우리 반에도 친절 한 칸, 더해볼까요?</h2>
        <DdakButton className="w-full mt-5" onClick={() => navigate('/teacher')}>우리 반 무무마니또 시작하기 →</DdakButton>
        {lastActivity && <DdakButton variant="secondary" className="w-full mt-3" onClick={() => navigate(`/teacher/share/${lastActivity}`)}>이 브라우저의 최근 QR 목록 열기</DdakButton>}
        <p className="text-sm leading-relaxed mt-5">명단은 교사 브라우저에, 도장은 학생이 사용한 브라우저에 저장돼요. 다른 기기와 기록이 이어지지 않으니 같은 기기로 참여해주세요.</p>
        <p className="text-xs leading-relaxed mt-3">학생은 선생님께 받은 개인 QR로 입장해요. 개인 링크에는 본인과 챙겨줄 친구 정보가 들어 있으니 해당 학생에게만 전달해주세요.</p>
      </DdakCard>
    </main>
  </DdakLayout>
}
