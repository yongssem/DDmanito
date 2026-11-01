import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import DdakInput from '../components/ddak/DdakInput'
import { trigger } from '../components/ddak/DdakConfetti'
import { matchManito } from '../lib/matching'
import { parseRoster, MAX_STUDENTS } from '../lib/roster'
import { todayInSeoul, addDays, validatePeriod, dateNumber } from '../lib/missions'
import { saveTeacherActivity } from '../lib/activity'

export default function TeacherSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [className, setClassName] = useState('')
  const [start, setStart] = useState(todayInSeoul)
  const [end, setEnd] = useState(() => addDays(todayInSeoul(), 13))
  const [students, setStudents] = useState(() => Array.from({ length: 5 }, (_, i) => ({ num: i + 1, name: '' })))
  const [paste, setPaste] = useState('')
  const [activityId, setActivityId] = useState('')
  const inputRefs = useRef({})
  const pendingFocus = useRef(null)
  const filledCount = students.filter((s) => s.name.trim()).length
  const parsed = useMemo(() => {
    if (!paste.trim()) return null
    try { return { students: parseRoster(paste) } } catch (error) { return { error: error.message } }
  }, [paste])

  useEffect(() => {
    if (pendingFocus.current !== null) {
      inputRefs.current[pendingFocus.current]?.focus()
      pendingFocus.current = null
    }
  }, [students])

  function nextStep() {
    if (!className.trim()) return toast.error('학급 이름을 입력해주세요.')
    try { validatePeriod(start, end); setStep(2) } catch (error) { toast.error(error.message) }
  }

  function addRow() {
    if (students.length >= MAX_STUDENTS) return toast.error(`학생은 ${MAX_STUDENTS}명까지 입력할 수 있어요.`)
    const num = Math.max(0, ...students.map((s) => s.num)) + 1
    if (num > 999) return toast.error('출석번호는 999번까지 사용할 수 있어요.')
    pendingFocus.current = num
    setStudents((rows) => [...rows, { num, name: '' }])
  }

  function applyPaste() {
    if (!parsed?.students) return
    setStudents(parsed.students)
    setPaste('')
    toast.success(`${parsed.students.filter((s) => s.name).length}명 명단을 적용했어요.`)
  }

  function handleMatch() {
    try {
      const matched = matchManito(students)
      const id = crypto.randomUUID()
      saveTeacherActivity({ v: 2, id, c: className.trim(), start, end, students: matched })
      setActivityId(id)
      setStep(3)
      trigger()
    } catch (error) {
      toast.error(error.name === 'QuotaExceededError' || error.name === 'SecurityError'
        ? '이 브라우저에 QR 목록을 저장할 수 없어요. 저장 공간·사이트 설정을 확인해주세요.' : error.message)
    }
  }

  return (
    <DdakLayout>
      <DdakHeader title="비밀 친구 탐험 만들기" subtitle={`${step} / 3 단계 · 선생님 준비실`} emoji="🧭" />
      <main className="flex-1 max-w-xl mx-auto w-full px-5 py-8 space-y-5">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {step === 1 && <>
            <DdakCard>
              <h2 className="text-xl mb-5">우리 반 탐험 일정</h2>
              <label htmlFor="class-name" className="block text-sm font-bold mb-2">학급 이름</label>
              <DdakInput id="class-name" value={className} maxLength={60} onChange={(e) => setClassName(e.target.value)} placeholder="예: 3학년 2반 사랑반" autoFocus />
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div><label htmlFor="activity-start" className="block text-sm font-bold mb-2">활동 시작일</label>
                  <DdakInput id="activity-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
                <div><label htmlFor="activity-end" className="block text-sm font-bold mb-2">활동 마지막 날</label>
                  <DdakInput id="activity-end" type="date" value={end} min={start} max={Number.isFinite(dateNumber(start)) ? addDays(start, 59) : undefined} onChange={(e) => setEnd(e.target.value)} /></div>
              </div>
              <p className="text-sm leading-relaxed mt-4 text-ddak-text/80">1~60일 동안 하루에 하나씩 미션이 열려요. 날짜는 한국 시간을 기준으로 해요. 마니또 상대는 QR을 받은 날부터 확인할 수 있어요.</p>
            </DdakCard>
            <DdakButton className="w-full mt-5" disabled={!className.trim() || !start || !end} onClick={nextStep}>다음 · 학생 명단 입력 →</DdakButton>
          </>}
          {step === 2 && <>
            <DdakCard>
              <h2 className="text-xl mb-2">엑셀에서 한 번에 붙여넣기</h2>
              <p id="paste-help" className="text-sm leading-relaxed mb-3">엑셀의 <b>이름 한 열</b> 또는 <b>번호·이름 두 열</b>을 복사해주세요. 제목 행과 결번을 지원해요. 같은 이름도 출석번호로 구분해요.</p>
              <label htmlFor="roster-paste" className="sr-only">엑셀 명단 붙여넣기</label>
              <DdakInput id="roster-paste" type="textarea" rows={4} value={paste} onChange={(e) => setPaste(e.target.value)} aria-describedby="paste-help paste-preview" placeholder={'번호\t이름\n1\t김하늘\n3\t이바다'} />
              <p id="paste-preview" className="text-sm mt-3" aria-live="polite">{parsed?.error || (parsed?.students ? `${parsed.students.filter((s) => s.name).length}명 확인됨 · 적용하면 아래 명단을 바꿔요.` : '붙여넣은 내용은 적용 전에 확인할 수 있어요.')}</p>
              <DdakButton variant="secondary" className="w-full mt-3" disabled={!parsed?.students} onClick={applyPaste}>붙여넣은 명단 적용</DdakButton>
            </DdakCard>
            <DdakCard className="mt-5">
              <h2 className="text-xl mb-1">학생 명단 확인</h2>
              <p className="text-sm mb-4">결번은 비워두세요. 동명이인은 번호로 구분돼요.</p>
              <div className="space-y-2">
                {students.map((student, index) => <div key={student.num} className="flex items-center gap-2">
                  <label htmlFor={`student-${student.num}`} className="w-12 shrink-0 text-center text-sm font-bold">{student.num}번</label>
                  <DdakInput id={`student-${student.num}`} ref={(el) => { if (el) inputRefs.current[student.num] = el; else delete inputRefs.current[student.num] }} value={student.name} maxLength={30} placeholder="이름" className="flex-1 min-w-0 !px-3 !py-2" onChange={(e) => setStudents((rows) => rows.map((s) => s.num === student.num ? { ...s, name: e.target.value } : s))} onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); if (students[index + 1]) inputRefs.current[students[index + 1].num]?.focus(); else addRow() }
                  }} />
                  <button type="button" aria-label={`${student.num}번 행 삭제`} className="ink-icon-button" onClick={() => setStudents((rows) => rows.filter((s) => s.num !== student.num))}>✕</button>
                </div>)}
              </div>
              <DdakButton variant="secondary" className="w-full mt-4" disabled={students.length >= MAX_STUDENTS} onClick={addRow}>＋ 학생 추가</DdakButton>
              <p className="text-center text-sm mt-4" aria-live="polite">현재 입력된 학생 <b>{filledCount}명</b></p>
            </DdakCard>
            <p className="text-xs leading-relaxed mt-4">명단과 교사용 QR 목록은 이 브라우저에 저장해요. 공용 PC에서는 사용 후 브라우저의 사이트 데이터를 삭제해주세요.</p>
            <div className="flex gap-3 mt-5">
              <DdakButton variant="secondary" className="flex-1" onClick={() => setStep(1)}>← 이전</DdakButton>
              <DdakButton className="flex-1" disabled={filledCount < 2 || Boolean(paste.trim())} onClick={handleMatch}>✨ 매칭하기</DdakButton>
            </div>
            {paste.trim() && <p className="text-sm mt-3">붙여넣은 명단을 적용하거나 입력란을 비운 뒤 매칭해주세요.</p>}
          </>}
          {step === 3 && <>
            <DdakCard>
              <p className="text-5xl text-center mb-4">🎒</p>
              <h2 className="text-2xl text-center">비밀 친구 탐험 준비 완료!</h2>
              <p className="text-center mt-4 font-bold">{className} · {filledCount}명</p>
              <p className="text-center text-sm mt-2">{start} ~ {end}</p>
              <p className="text-sm leading-relaxed mt-5">학생마다 다른 QR이 생겼어요. 해당 학생에게만 전달해주세요. 학생 링크에는 본인과 챙겨줄 친구의 정보만 들어 있어요.</p>
            </DdakCard>
            <DdakButton className="w-full mt-5" onClick={() => navigate(`/teacher/share/${activityId}`)}>학생별 QR 배부하기 →</DdakButton>
            <DdakButton variant="secondary" className="w-full mt-3" onClick={() => { setStep(1); setActivityId('') }}>새 활동 만들기</DdakButton>
          </>}
        </motion.div>
      </main>
    </DdakLayout>
  )
}
