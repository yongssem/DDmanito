import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Sparkle, ArrowLeft, ShieldCheck } from '@phosphor-icons/react'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import DdakInput from '../components/ddak/DdakInput'
import { trigger as triggerConfetti } from '../components/ddak/DdakConfetti'
import { decodeMatching } from '../lib/encode'

const REVEAL_DELAY_MS = 500
const MAX_FAILS = 3
const LOCK_DURATION_MS = 5 * 60 * 1000 // 5분
const stepSpring = { type: 'spring', stiffness: 200, damping: 22 }

function cacheKey(encoded) {
  return `ddakmanito:${encoded.slice(0, 16)}`
}
// 학생별 독립 잠금: 같은 링크 안에서도 num이 다르면 서로 영향 없음
function lockKey(encoded, num) {
  return `ddakmanito-lock:${encoded.slice(0, 16)}:${num}`
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// 만료된 잠금은 읽는 시점에 자동 정리 — 별도 setInterval 없이 lazy 만료
function readLockState(encoded, num) {
  const raw = readJSON(lockKey(encoded, num))
  if (!raw) return { locked: false, unlockAt: null, failCount: 0 }
  if (raw.unlockAt && raw.unlockAt > Date.now()) {
    return { locked: true, unlockAt: raw.unlockAt, failCount: 0 }
  }
  if (raw.unlockAt && raw.unlockAt <= Date.now()) {
    localStorage.removeItem(lockKey(encoded, num))
    return { locked: false, unlockAt: null, failCount: 0 }
  }
  return { locked: false, unlockAt: null, failCount: raw.failCount || 0 }
}

export default function StudentReveal() {
  const { encoded } = useParams()
  const navigate = useNavigate()
  const data = useMemo(() => decodeMatching(encoded), [encoded])

  const students = useMemo(() => {
    if (!data || !Array.isArray(data.s) || !Array.isArray(data.m)) return []
    return data.s.map(([num, name], i) => ({ num, name, manitoNum: data.m[i] }))
  }, [data])

  // step: 0=경고, 1=이름선택, 2=1차인증, 3=2차인증, 4=공개
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState(null)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('waiting')
  const [failCount, setFailCount] = useState(0)
  const inputRef = useRef(null)

  // 진입 시 verified 캐시만 자동 복원 — 미인증 캐시는 일반 흐름으로
  useEffect(() => {
    if (!data || !data.m) return
    const cache = readJSON(cacheKey(encoded))
    if (cache && cache.verified && cache.num != null) {
      const found = students.find((s) => s.num === cache.num)
      if (found) {
        setPicked(found)
        setStep(4)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, encoded])

  useEffect(() => {
    if (step !== 4) return
    setPhase('waiting')
    const t = setTimeout(() => {
      setPhase('reveal')
      triggerConfetti()
    }, REVEAL_DELAY_MS)
    return () => clearTimeout(t)
  }, [step, picked])

  useEffect(() => {
    if (step === 2 || step === 3) {
      setInput('')
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [step])

  if (!data || !data.m || !data.c) {
    return (
      <DdakLayout>
        <DdakHeader title="잘못된 링크" subtitle="선생님께 다시 받아주세요" emoji="⚠️" />
        <main className="flex-1 max-w-md mx-auto w-full px-6 py-10">
          <DdakCard delay={0.2}>
            <p className="text-center leading-relaxed">
              링크가 손상되었거나 만료됐어요.<br />
              <span className="text-sm opacity-70">선생님께 새 링크를 받아주세요.</span>
            </p>
          </DdakCard>
          <div className="mt-8">
            <DdakButton variant="secondary" className="w-full" onClick={() => navigate('/')}>
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft size={20} weight="bold" />
                홈으로
              </span>
            </DdakButton>
          </div>
        </main>
      </DdakLayout>
    )
  }

  function handlePick(student) {
    const ls = readLockState(encoded, student.num)
    if (ls.locked) {
      const mins = Math.max(1, Math.ceil((ls.unlockAt - Date.now()) / 60000))
      toast.error(`${student.name}님의 인증이 잠시 잠겼어요. ${mins}분 후 다시 시도해주세요`)
      return
    }
    setPicked(student)
    setFailCount(ls.failCount)
    localStorage.setItem(cacheKey(encoded), JSON.stringify({ num: student.num, verified: false }))
    setStep(2)
  }

  function recordFail() {
    const next = failCount + 1
    if (next >= MAX_FAILS) {
      const unlockAt = Date.now() + LOCK_DURATION_MS
      localStorage.setItem(
        lockKey(encoded, picked.num),
        JSON.stringify({ failCount: 0, unlockAt })
      )
      toast.error(`${picked.name}님이 3번 틀려서 5분간 잠겼어요`)
      // 잠금 발동 → Step 1(이름 그리드)로 바운스
      setFailCount(0)
      setPicked(null)
      setStep(1)
    } else {
      localStorage.setItem(
        lockKey(encoded, picked.num),
        JSON.stringify({ failCount: next, unlockAt: null })
      )
      setFailCount(next)
      toast.error(`출석번호가 맞지 않아요 (${next}/${MAX_FAILS})`)
    }
  }

  function handleVerify() {
    const trimmed = input.trim()
    if (!trimmed) return
    if (trimmed === String(picked.num)) {
      setInput('')
      if (step === 2) {
        setStep(3)
      } else {
        localStorage.setItem(
          cacheKey(encoded),
          JSON.stringify({ num: picked.num, verified: true })
        )
        localStorage.removeItem(lockKey(encoded, picked.num))
        setFailCount(0)
        setStep(4)
      }
    } else {
      recordFail()
      setInput('')
    }
  }

  function handleAuthKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleVerify()
    }
  }

  function handleReplay() {
    setPhase('waiting')
    setTimeout(() => {
      setPhase('reveal')
      triggerConfetti()
    }, REVEAL_DELAY_MS)
  }

  const manitoStudent = picked ? students.find((s) => s.num === picked.manitoNum) : null

  return (
    <DdakLayout>
      <DdakHeader title="🎁 너의 마니또는?" subtitle="이름을 눌러봐" emoji="🤫" />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-10">
        <AnimatePresence mode="wait">
          {/* ─── Step 0: 경고 카드 ─── */}
          {step === 0 && (
            <motion.div
              key="warn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={stepSpring}
            >
              <DdakCard>
                <div className="flex justify-center mb-3">
                  <ShieldCheck size={42} weight="duotone" className="text-ddak-accent" />
                </div>
                <h2 className="font-ssurround text-xl text-center mb-4">
                  잠깐! 시작 전 꼭 읽어주세요
                </h2>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>🤫 마니또는 본인만 확인할 수 있어요</li>
                  <li>🔐 출석번호를 두 번 입력해서 본인 확인을 해요</li>
                  <li>⏰ 3번 틀리면 그 학생만 5분간 잠겨요</li>
                  <li>🔁 한 번 확인하면 다른 이름으로 바꿀 수 없어요</li>
                  <li>📱 다시 보고 싶을 땐 시크릿 모드로 접속하세요</li>
                </ul>
              </DdakCard>
              <div className="mt-6">
                <DdakButton variant="primary" className="w-full" onClick={() => setStep(1)}>
                  확인했어요
                </DdakButton>
              </div>
            </motion.div>
          )}

          {/* ─── Step 1: 이름 선택 ─── */}
          {step === 1 && (
            <motion.div
              key="pick"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={stepSpring}
            >
              <DdakCard>
                <h2 className="font-ssurround text-2xl text-center text-ddak-text">{data.c}</h2>
                <p className="font-bombom text-2xl text-center text-ddak-accent mt-2 mb-5">
                  내 이름을 찾아주세요!
                </p>
                <div
                  className={`grid gap-3 ${students.length >= 21 ? 'grid-cols-3' : 'grid-cols-2'}`}
                >
                  {students.map((s) => (
                    <DdakButton
                      key={s.num}
                      variant="secondary"
                      className={`w-full ${students.length >= 21 ? 'text-sm px-3 py-2' : ''}`}
                      onClick={() => handlePick(s)}
                    >
                      {s.name}
                    </DdakButton>
                  ))}
                </div>
              </DdakCard>
            </motion.div>
          )}

          {/* ─── Step 2 & 3: 출석번호 인증 ─── */}
          {(step === 2 || step === 3) && picked && (
            <motion.div
              key={`auth-${step}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={stepSpring}
            >
              <DdakCard>
                <p className="text-center text-ddak-text/70">
                  <span className="font-bold text-ddak-text">{picked.name}</span>님이군요!
                </p>
                <h2 className="font-ssurround text-xl text-center mt-3 mb-1">
                  {step === 2 ? '출석번호를 입력해주세요' : '한 번 더 입력해주세요 🌸'}
                </h2>
                <p className="text-center text-sm text-ddak-text/60 mb-5">
                  {step === 2 ? '본인 확인이에요' : '실수 방지를 위한 두 번째 확인이에요'}
                </p>
                <DdakInput
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={3}
                  value={input}
                  onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={handleAuthKeyDown}
                  placeholder="번호"
                  className="!text-center !text-2xl !font-bold"
                />
                {failCount > 0 && (
                  <p className="text-center text-sm text-ddak-accent mt-3">
                    틀린 횟수: {failCount} / {MAX_FAILS}
                  </p>
                )}
              </DdakCard>

              <div className="mt-6">
                <DdakButton
                  variant="primary"
                  className={`w-full ${!input.trim() ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={handleVerify}
                >
                  확인
                </DdakButton>
              </div>
            </motion.div>
          )}

          {/* ─── Step 4: 마니또 공개 ─── */}
          {step === 4 && picked && manitoStudent && (
            <motion.div
              key="reveal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={stepSpring}
            >
              <DdakCard>
                <p className="text-center text-lg text-ddak-text/80">
                  <span className="font-bold text-ddak-text">{picked.name}</span>님의 마니또는...
                </p>

                <div className="my-6 min-h-[180px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {phase === 'waiting' && (
                      <motion.p
                        key="waiting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-bombom text-3xl text-ddak-accent"
                      >
                        두근두근...
                      </motion.p>
                    )}
                    {phase === 'reveal' && (
                      <motion.div
                        key="reveal"
                        initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                        className="px-6 py-6 rounded-2xl bg-gradient-to-br from-ddak-pink/40 to-ddak-lavender/40"
                      >
                        <p className="font-ssurround text-6xl text-ddak-accent text-center">
                          {manitoStudent.name}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {phase === 'reveal' && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="font-bombom text-2xl text-center text-ddak-accent"
                  >
                    다른 친구에게 보여주지 마세요! 🤫
                  </motion.p>
                )}
              </DdakCard>

              {phase === 'reveal' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="mt-8"
                >
                  <DdakButton variant="primary" className="w-full" onClick={handleReplay}>
                    <span className="flex items-center justify-center gap-2">
                      <Sparkle size={20} weight="bold" />
                      다시 보기
                    </span>
                  </DdakButton>
                  <p className="text-center text-xs text-ddak-text/60 mt-4">
                    다시 보고 싶을 땐 시크릿 모드로 접속하세요 🌸
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </DdakLayout>
  )
}
