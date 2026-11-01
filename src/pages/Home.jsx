import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import { lastTeacherActivity } from '../lib/activity'

export default function Home() {
  const navigate = useNavigate()
  const [lastActivity] = useState(lastTeacherActivity)
  return <DdakLayout>
    <DdakHeader logoSrc="/logo.png" title="뚝딱마니또" subtitle="작은 친절이 모이는 우리 반 비밀 친구 탐험" emoji="🎒" />
    <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8 space-y-5">
      <DdakCard>
        <span className="text-xs font-bold rounded-full bg-ddak-mint/60 px-3 py-2">우리 반 우정 퀘스트</span>
        <h2 className="text-3xl leading-snug mt-5">비밀 친구에게<br />오늘의 친절을 선물해요.</h2>
        <p className="leading-relaxed text-sm mt-4">학생별 QR로 만나고, 매일 미션을 실천하고,<br />나만의 탐험 여권에 도장을 모아보세요.</p>
        <DdakButton className="w-full mt-6" onClick={() => navigate('/teacher')}>🧭 선생님 · 탐험 만들기</DdakButton>
        {lastActivity && <DdakButton variant="secondary" className="w-full mt-3" onClick={() => navigate(`/teacher/share/${lastActivity}`)}>이 브라우저의 최근 QR 목록 열기</DdakButton>}
        <p className="text-xs text-center mt-4">학생은 선생님께 받은 개인 QR로 입장해주세요.</p>
      </DdakCard>
      <div className="grid grid-cols-3 gap-2">
        {[['💌', '학생별 QR', '한 명에게 한 장씩'], ['📋', '명단 붙여넣기', '엑셀에서 바로'], ['🌟', '매일 미션', '친절 도장 모으기']].map(([emoji, title, desc]) => <div key={title} className="rounded-3xl bg-white/80 border border-ddak-pink/60 text-center px-2 py-5">
          <p className="text-3xl" aria-hidden="true">{emoji}</p><h3 className="text-sm mt-3">{title}</h3><p className="text-[11px] mt-2">{desc}</p>
        </div>)}
      </div>
      <DdakCard>
        <h2 className="text-xl">준비는 가볍게, 마음은 따뜻하게</h2>
        <ol className="space-y-4 mt-5 text-sm">
          <li><b>01 ·</b> 학급과 활동 기간을 정하고 명단을 붙여넣어요.</li>
          <li><b>02 ·</b> 학생별 QR 초대장을 인쇄해 한 장씩 나눠요.</li>
          <li><b>03 ·</b> 비밀 친구를 확인하고 오늘의 미션을 실천해요.</li>
          <li><b>04 ·</b> 마지막 날 감사 인사를 나누며 함께 마무리해요.</li>
        </ol>
      </DdakCard>
      <DdakCard className="!bg-ddak-lavender/30">
        <h2 className="text-lg">회원가입·앱 설치 없이 시작해요</h2>
        <p className="text-sm leading-relaxed mt-3">명단은 교사 브라우저에 저장돼요. 학생 링크에는 본인과 챙겨줄 친구의 정보만 포함되고, 도장은 학생 브라우저에 저장돼요.</p>
        <p className="text-xs leading-relaxed mt-3">개인 QR은 해당 학생에게만 전달해주세요. 학생 링크를 가진 사람은 그 결과를 볼 수 있어요.</p>
      </DdakCard>
    </main>
  </DdakLayout>
}
