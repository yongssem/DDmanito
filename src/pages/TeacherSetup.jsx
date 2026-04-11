import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  CaretRight,
  CaretLeft,
  Sparkle,
  Share,
  ArrowCounterClockwise,
  Plus,
  X,
} from '@phosphor-icons/react'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import DdakInput from '../components/ddak/DdakInput'
import { trigger as triggerConfetti } from '../components/ddak/DdakConfetti'
import { matchManito } from '../lib/matching'
import { encodeMatching } from '../lib/encode'

const stepSpring = { type: 'spring', stiffness: 220, damping: 26 }
const stepVariants = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
}

const INITIAL_ROWS = 5

function makeInitialStudents() {
  return Array.from({ length: INITIAL_ROWS }, (_, i) => ({ num: i + 1, name: '' }))
}

export default function TeacherSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [className, setClassName] = useState('')
  const [students, setStudents] = useState(makeInitialStudents)
  const [encoded, setEncoded] = useState('')

  // 행별 ref — Enter 내비/새 행 추가 후 포커스 이동에 사용
  const inputRefs = useRef({})
  const pendingFocusNum = useRef(null)

  const filled = useMemo(
    () => students.filter((s) => s.name.trim().length > 0),
    [students]
  )
  const filledCount = filled.length
  const maxNum = students.length > 0 ? Math.max(...students.map((s) => s.num)) : 0

  const canNext1 = className.trim().length > 0
  const canNext2 = filledCount >= 2

  // 새 행 추가 후 그 행 input으로 포커스
  useEffect(() => {
    if (pendingFocusNum.current != null) {
      const el = inputRefs.current[pendingFocusNum.current]
      if (el) el.focus()
      pendingFocusNum.current = null
    }
  }, [students])

  useEffect(() => {
    if (step === 3) triggerConfetti()
  }, [step])

  function updateName(num, name) {
    setStudents((prev) => prev.map((s) => (s.num === num ? { ...s, name } : s)))
  }

  function addRow(focusNew = false) {
    setStudents((prev) => {
      const nextNum = prev.length === 0 ? 1 : Math.max(...prev.map((s) => s.num)) + 1
      if (focusNew) pendingFocusNum.current = nextNum
      return [...prev, { num: nextNum, name: '' }]
    })
  }

  function removeRow(num) {
    setStudents((prev) => prev.filter((s) => s.num !== num))
  }

  // 행 삭제 가능 조건: 비어있거나 마지막 행 (중간 결번 보존을 위해)
  function canDelete(idx) {
    const s = students[idx]
    if (!s) return false
    const isLast = idx === students.length - 1
    const isEmpty = !s.name.trim()
    return isLast || isEmpty
  }

  function handleRowKeyDown(e, idx) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const next = students[idx + 1]
    if (next) {
      inputRefs.current[next.num]?.focus()
    } else {
      addRow(true) // 마지막 행 → 새 행 추가 + 포커스
    }
  }

  function handleMatch() {
    // 중복은 matchManito에서도 잡지만, 메시지를 빠르게 보여주려고 사전 체크
    const names = filled.map((s) => s.name.trim())
    if (new Set(names).size !== names.length) {
      toast.error('중복된 이름이 있어요. 명단을 확인해 주세요.')
      return
    }
    try {
      const matched = matchManito(students) // [{num, name, manitoNum}]
      // 인코딩 스키마: {c, s:[[num,name],...], m:[manitoNum,...]} — 매칭 결과 그대로 압축
      const data = {
        c: className.trim(),
        s: matched.map((s) => [s.num, s.name]),
        m: matched.map((s) => s.manitoNum),
      }
      setEncoded(encodeMatching(data))
      setStep(3)
    } catch (err) {
      toast.error(err.message || '매칭에 실패했어요.')
    }
  }

  function handleReset() {
    setStep(1)
    setEncoded('')
  }

  return (
    <DdakLayout>
      <DdakHeader title="학급 만들기" subtitle={`${step} / 3 단계`} emoji="👩‍🏫" />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepSpring}
            >
              <DdakCard>
                <h2 className="font-ssurround text-xl mb-4 text-center">
                  학급 이름을 알려주세요
                </h2>
                <DdakInput
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="예: 3학년 2반 사랑반"
                  autoFocus
                />
              </DdakCard>

              <div className="mt-6">
                <DdakButton
                  variant="primary"
                  className={`w-full ${!canNext1 ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => canNext1 && setStep(2)}
                >
                  <span className="flex items-center justify-center gap-2">
                    다음
                    <CaretRight size={20} weight="bold" />
                  </span>
                </DdakButton>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepSpring}
            >
              <DdakCard>
                <h2 className="font-ssurround text-xl mb-1 text-center">
                  출석번호 순서대로 이름을 입력해주세요
                </h2>
                <p className="text-center text-sm text-ddak-text/60 mb-4">
                  결번이 있으면 비워두세요
                </p>

                <div className="space-y-2">
                  {students.map((s, idx) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-ddak-cream border border-ddak-pink/30 flex items-center justify-center text-sm font-bold text-ddak-text/60">
                        {s.num}
                      </span>
                      <DdakInput
                        ref={(el) => {
                          if (el) inputRefs.current[s.num] = el
                          else delete inputRefs.current[s.num]
                        }}
                        value={s.name}
                        onChange={(e) => updateName(s.num, e.target.value)}
                        onKeyDown={(e) => handleRowKeyDown(e, idx)}
                        placeholder="이름"
                        className="flex-1 !px-3 !py-2 !text-base"
                      />
                      <button
                        type="button"
                        onClick={() => removeRow(s.num)}
                        disabled={!canDelete(idx)}
                        aria-label="행 삭제"
                        className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-ddak-text/40 hover:text-ddak-accent hover:bg-ddak-pink/20 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ddak-text/40 transition"
                      >
                        <X size={16} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <DdakButton
                    variant="secondary"
                    className="w-full !py-2 !text-sm"
                    onClick={() => addRow(true)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Plus size={16} weight="bold" />
                      학생 추가
                    </span>
                  </DdakButton>
                </div>

                <p className="text-center text-sm text-ddak-text/70 mt-4">
                  현재 입력된 학생: <span className="font-bold text-ddak-accent">{filledCount}</span>명{' '}
                  <span className="text-ddak-text/50">(총 {maxNum}번까지)</span>
                </p>
              </DdakCard>

              <div className="mt-6 flex gap-3">
                <DdakButton variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                  <span className="flex items-center justify-center gap-2">
                    <CaretLeft size={20} weight="bold" />
                    이전
                  </span>
                </DdakButton>
                <DdakButton
                  variant="primary"
                  className={`flex-1 ${!canNext2 ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => canNext2 && handleMatch()}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkle size={20} weight="bold" />
                    매칭하기
                  </span>
                </DdakButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepSpring}
            >
              <DdakCard>
                <h2 className="font-ssurround text-2xl mb-3 text-center text-ddak-accent">
                  ✨ 매칭 완료!
                </h2>
                <div className="text-center space-y-1 mb-2">
                  <p className="font-pretendard">
                    <span className="font-bold">{className.trim()}</span>
                  </p>
                  <p className="text-sm text-ddak-text/70">학생 {filledCount}명</p>
                </div>
                <p className="font-bombom text-2xl text-center text-ddak-accent mt-4">
                  뚝딱! 비밀 친구가 정해졌어요 🎀
                </p>
              </DdakCard>

              <div className="mt-8 flex flex-col gap-4">
                <DdakButton
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/share/${encoded}`)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Share size={20} weight="bold" />
                    결과 공유하기
                  </span>
                </DdakButton>
                <DdakButton variant="secondary" className="w-full" onClick={handleReset}>
                  <span className="flex items-center justify-center gap-2">
                    <ArrowCounterClockwise size={20} weight="bold" />
                    다시 만들기
                  </span>
                </DdakButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </DdakLayout>
  )
}
