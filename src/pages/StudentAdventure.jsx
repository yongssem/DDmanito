import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import MissionBoard from '../components/manito/MissionBoard'
import { trigger } from '../components/ddak/DdakConfetti'
import { decodeStudentActivity, readProgress, progressKey, createDemoActivity } from '../lib/activity'
import { todayInSeoul, activityDay } from '../lib/missions'

export default function StudentAdventure() {
  const { hash, pathname } = useLocation()
  const demo = pathname === '/demo'
  return <AdventureContent key={demo ? "demo" : hash} hash={hash} demo={demo} />
}

function AdventureContent({ hash, demo }) {
  const navigate = useNavigate()
  const [data] = useState(() => demo ? createDemoActivity(todayInSeoul()) : decodeStudentActivity(hash))
  const [confirmed, setConfirmed] = useState(Boolean(demo))
  const [visible, setVisible] = useState(false)
  const [today, setToday] = useState(todayInSeoul)
  const [completed, setCompleted] = useState(() => data ? readProgress(data, todayInSeoul()) : [])

  useEffect(() => {
    const refresh = () => setToday(todayInSeoul())
    const timer = setInterval(refresh, 30000)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    const sync = (event) => { if (data && event.key === progressKey(data)) setCompleted(readProgress(data, todayInSeoul())) }
    window.addEventListener('storage', sync)
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('storage', sync) }
  }, [data])

  function completeMission() {
    const date = todayInSeoul()
    setToday(date)
    if (activityDay(data.start, data.end, date).status !== 'active') {
      toast('지금은 활동 기간이 아니에요.')
      return
    }
    const latest = readProgress(data, date)
    if (latest.includes(date) || completed.includes(date)) return
    const next = [...new Set([...latest, ...completed, date])].sort()
    try { localStorage.setItem(progressKey(data), JSON.stringify(next)) }
    catch { toast.error('도장을 저장하지 못했어요. 사이트 저장 설정을 확인해주세요.'); return }
    setCompleted(next)
    trigger()
    toast.success('오늘의 친절이 도장으로 남았어요!')
  }

  return <DdakLayout>
    <DdakHeader title="비밀 친구 탐험" subtitle={data ? `${data.c} · 나만의 초대장` : '초대장을 다시 확인해주세요'} emoji="🗺️" />
    <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8 space-y-5">
      {demo && <div className="ink-subcard p-4 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-base">🎮 학생 화면 체험 중</h2><p className="text-xs mt-1">예시 이름으로 진행해요. 실제 명단은 필요 없어요.</p></div>
        <DdakButton className="!text-sm" onClick={() => navigate('/teacher')}>우리 반 만들기 →</DdakButton>
      </div>}
      {!data ? <DdakCard>
        <h2 className="text-xl">학생 QR을 다시 받아주세요</h2>
        <p className="text-sm leading-relaxed mt-3">주소가 잘렸거나 올바른 초대장이 아니에요. 선생님께 받은 QR을 다시 스캔해주세요.</p>
      </DdakCard> : !confirmed ? <DdakCard>
        <p className="text-5xl text-center mb-4">💌</p>
        <h2 className="text-2xl text-center">{data.p[0]}번 {data.p[1]}님의 초대장</h2>
        <p className="text-sm leading-relaxed mt-5">내 초대장이 맞는지 확인해주세요. 다른 친구의 QR이라면 화면을 닫고 선생님께 알려주세요.</p>
        <p className="text-sm leading-relaxed mt-3">{data.start} ~ {data.end} 동안 비밀 친구를 챙겨요. QR이나 링크를 다른 친구에게 전달하지 마세요.</p>
        <DdakButton className="w-full mt-6" onClick={() => setConfirmed(true)}>내 초대장이 맞아요 · 탐험 시작</DdakButton>
      </DdakCard> : <>
        <DdakCard>
          <p className="text-sm font-bold">🎒 {data.p[0]}번 {data.p[1]}의 비밀 임무</p>
          <h2 className="text-xl mt-3">내가 챙겨줄 친구는?</h2>
          {visible ? <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="ink-subcard mt-4 p-6 text-center" aria-live="polite">
            <p className="text-sm">{data.t[0]}번</p><p className="font-ssurround text-3xl sm:text-4xl break-words mt-1">{data.t[1]}</p>
            <p className="text-sm mt-3">따뜻한 마음으로 몰래 응원해줘요 🤫</p>
          </motion.div> : <p className="text-sm mt-4">주변에 친구가 없는 곳에서 살짝 확인해요.</p>}
          <DdakButton variant="secondary" className="w-full mt-4" onClick={() => { setVisible(!visible); if (!visible) trigger() }}>{visible ? '🙈 이름 다시 가리기' : '🎁 내 마니또 확인하기'}</DdakButton>
          <p className="text-xs mt-4 text-center">{data.start} ~ {data.end} · 한국 시간 기준</p>
        </DdakCard>
        <MissionBoard key={today} data={data} today={today} completed={completed} onComplete={completeMission} />
      </>}
    </main>
  </DdakLayout>
}
