import { useState } from 'react'
import PixelGuide from './PixelGuide'
import DdakCard from '../ddak/DdakCard'
import DdakButton from '../ddak/DdakButton'
import { activityDay, missionForDay, addDays } from '../../lib/missions'

const islands = [
  { emoji: '🏕️', name: '시작 캠프' }, { emoji: '🌳', name: '미소 숲' },
  { emoji: '🌷', name: '배려 정원' }, { emoji: '🌈', name: '응원 다리' }, { emoji: '🏡', name: '우정 마을' },
]

export default function MissionBoard({ data, today, completed, onComplete }) {
  const state = activityDay(data.start, data.end, today)
  const doneToday = completed.includes(today)
  const [opened, setOpened] = useState(doneToday)
  const count = completed.length
  const badge = count >= 14 ? '🏅 다정함의 달인' : count >= 7 ? '🧭 우정 탐험가' : count >= 3 ? '🌱 새싹 친구' : '🌰 씨앗 친구'
  const currentIsland = Math.min(4, Math.floor(count / state.duration * 5))
  const mission = state.status === 'active' ? missionForDay(state.day, state.duration) : null
  return <section className="mission-dashboard" aria-label="나의 미션 여권">


    <DdakCard className="mission-task">
      <div className="flex justify-between items-center gap-3">
        <h2 className="text-xl">오늘의 비밀 임무</h2>
        <span className="ink-badge">{state.status === 'active' ? `DAY ${state.day}` : state.status === 'upcoming' ? `시작 D-${state.remaining}` : '탐험 완료'}</span>
      </div>
      {mission && !opened ? <div className="quest-envelope mt-5 text-center">
        <PixelGuide />
        <p className="ink-badge mt-3">무무에게서 임무가 도착했어요!</p>
        <h3 className="text-2xl mt-4">오늘의 비밀 작전은…?</h3>
        <p className="text-sm mt-3">친구 곁에서 펼쳐질 작은 모험. 준비됐나요?</p>
        <DdakButton className="w-full mt-5" onClick={() => setOpened(true)}>💌 임무 봉투 열기</DdakButton>
      </div> : mission ? <div className="quest-unsealed">
        <div className="quest-briefing mt-5"><PixelGuide celebrate={doneToday} /><p className="ink-subcard p-4 text-sm">{doneToday ? '임무 성공! 오늘 네가 건넨 친절, 무무가 기억할게.' : '탐험대원, 오늘은 이 작전이야! 친구가 편안하게 느끼는 방법으로 해보자.'}</p></div>
        <p className="text-4xl mt-5" aria-hidden="true">{mission.emoji}</p>
        <h3 className="text-2xl mt-4">{mission.title}</h3>
        <p className="leading-relaxed mt-3">{mission.description}</p>
        <p className="text-xs text-ddak-text/80 mt-4">돈이나 선물은 필요 없어요. 상대가 불편해하면 멈추고 마음을 존중해요.</p>
        <DdakButton className="w-full mt-6" disabled={doneToday} onClick={onComplete}>{doneToday ? '✅ 오늘의 임무 성공!' : '🌟 임무 완료! · 친절 도장 받기'}</DdakButton>
        <p className="text-xs text-center mt-3" aria-live="polite">{doneToday ? '잘했어요! 다음 미션은 내일 만나요.' : '실제로 실천한 뒤 눌러주세요. 하루에 한 번 기록돼요.'}</p>
        <p className="text-sm text-center mt-4">{state.remaining === 0 ? '오늘은 활동 마지막 날이에요 💌' : `활동 마지막 날까지 ${state.remaining}일`}</p>
      </div> : <div className="py-6 text-center">
        <p className="text-5xl" aria-hidden="true">{state.status === 'upcoming' ? '🎒' : '🎉'}</p>
        <h3 className="text-xl mt-4">{state.status === 'upcoming' ? `${data.start}에 탐험을 시작해요` : '작은 친절이 모여 우정이 되었어요'}</h3>
        <p className="text-sm leading-relaxed mt-3">{state.status === 'upcoming' ? '오늘은 비밀 친구를 확인하고 준비해요. 시작일부터 하루 하나씩 미션이 열려요.' : `총 ${count}개의 실천을 기록했어요. 정체 공개는 선생님 안내에 따라 함께해요.`}</p>
      </div>}
    </DdakCard>

    <DdakCard className="mission-map ink-tint">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-xl">나의 미션 여권</h2>
        <span className="ink-badge">{badge}</span>
      </div>
      <p className="text-sm mt-2">작은 친절을 모아 우정 마을로 떠나요.</p>
      <ol className="grid grid-cols-5 gap-1 mt-5" aria-label="탐험 지도">
        {islands.map((island, index) => <li key={island.name} aria-current={index === currentIsland ? 'step' : undefined} className={`text-center quest-island py-3 ${index === currentIsland ? 'quest-island-current' : index < currentIsland ? 'quest-island-done' : ''}`}>
          <span className="block text-2xl" aria-hidden="true">{island.emoji}</span>
          <span className="block text-[10px] sm:text-xs mt-2 font-bold">{island.name}</span>
          {index === currentIsland && <span className="block text-[10px] mt-1">현재 위치</span>}
        </li>)}
      </ol>
      <div className="flex justify-between text-sm mt-5"><span>모은 도장 <b>{count}개</b></span><span>총 {state.duration}일</span></div>
      <progress className="mission-progress w-full h-3 mt-2" value={count} max={state.duration} aria-label="미션 완료 도장" />
    </DdakCard>

    <DdakCard className="mission-stamps">
      <h2 className="text-lg">친절 도장 모음</h2>
      <p className="text-xs mt-2 mb-4">놓친 날이 있어도 괜찮아요. 오늘부터 다시 시작하면 돼요.</p>
      <ol className="grid grid-cols-7 gap-2" aria-label="날짜별 도장">
        {Array.from({ length: state.duration }, (_, i) => {
          const date = addDays(data.start, i)
          const done = completed.includes(date)
          return <li key={date} title={`${date}${done ? ' 완료' : ''}`} aria-label={`${date}${done ? ' 미션 완료' : date > today ? ' 아직 열리지 않음' : ' 미완료'}`} className={`aspect-square flex flex-col items-center justify-center text-xs quest-stamp ${done ? 'quest-stamp-done' : date === today ? 'quest-stamp-today' : ''}`}>
            <span aria-hidden="true">{done ? '🌟' : i + 1}</span>
          </li>
        })}
      </ol>
      <p className="text-xs leading-relaxed mt-4">도장은 이 기기의 브라우저에 저장돼요. 다른 기기와 동기화되지 않으며, 사이트 데이터를 지우면 사라져요.</p>
    </DdakCard>
  </section>
}
