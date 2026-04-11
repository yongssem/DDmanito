import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Chalkboard } from '@phosphor-icons/react'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import DdakParticles from '../components/ddak/DdakParticles'

const spring = { type: 'spring', stiffness: 100, damping: 15 }

const features = [
  { emoji: '✨', title: '회원가입 없음', desc: '그냥 링크만 공유하면 끝' },
  { emoji: '🔒', title: '개인정보 0', desc: '학생 데이터 어디에도 저장 안 함' },
  { emoji: '📱', title: '모든 기기 OK', desc: '폰, PC, 태블릿 어디서든' },
]

const steps = [
  { n: 1, text: '선생님이 학급 만들고 학생 명단 입력' },
  { n: 2, text: '매칭 결과 링크를 카톡으로 학생들에게 공유' },
  { n: 3, text: '학생이 링크 들어가서 자기 이름 누르면 마니또 공개!' },
]

const v2Items = [
  { emoji: '📅', text: '공개일까지 카운트다운' },
  { emoji: '🎯', text: '매일 미션으로 두근두근' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <DdakLayout>
      <DdakParticles />

      <DdakHeader
        logoSrc="/logo.png"
        title="뚝딱마니또"
        subtitle="비밀 친구와 함께하는 따뜻한 한 달"
        emoji="🎁"
        delay={0}
      />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-10 space-y-5">
        {/* 1. 안내 */}
        <DdakCard delay={0.2}>
          <p className="font-bombom text-2xl text-center text-ddak-accent leading-relaxed">
            선생님이 학생 명단으로 마니또를 매칭하고,<br />
            생성된 링크를 카톡으로 보내면 끝!
          </p>
          <p className="text-center text-sm text-ddak-text/60 mt-3">
            회원가입도, 앱 설치도 필요 없어요
          </p>
        </DdakCard>

        {/* 2. 특징 */}
        <DdakCard delay={0.3}>
          <h3 className="font-ssurround text-xl text-center mb-4">왜 뚝딱마니또?</h3>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{f.emoji}</span>
                <div>
                  <p className="font-bold">{f.title}</p>
                  <p className="text-sm text-ddak-text/70">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </DdakCard>

        {/* 3. 사용법 */}
        <DdakCard delay={0.4}>
          <h3 className="font-ssurround text-xl text-center mb-4">이렇게 사용해요</h3>
          <ul className="space-y-3">
            {steps.map((s) => (
              <li key={s.n} className="flex items-start gap-3">
                <span className="inline-flex w-7 h-7 shrink-0 rounded-full bg-ddak-pink text-white items-center justify-center text-sm font-bold">
                  {s.n}
                </span>
                <p className="leading-snug pt-0.5">{s.text}</p>
              </li>
            ))}
          </ul>
        </DdakCard>

        {/* 4. CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="pt-2"
        >
          <DdakButton
            variant="primary"
            className="w-full text-lg py-4"
            onClick={() => navigate('/teacher')}
          >
            <span className="flex items-center justify-center gap-2">
              <Chalkboard size={24} weight="bold" />
              마니또 만들기
            </span>
          </DdakButton>
          <p className="text-center text-sm text-ddak-text/60 mt-3">
            학생이라면 선생님께 받은 링크로 들어와주세요 🌸
          </p>
        </motion.div>

        {/* 5. v2 예고 */}
        <DdakCard delay={0.6} className="!bg-ddak-lavender/30">
          <p className="font-bombom text-2xl text-center text-ddak-accent">
            곧 추가될 기능 ⏰
          </p>
          <ul className="space-y-2 mt-4">
            {v2Items.map((v) => (
              <li key={v.text} className="flex items-center gap-3">
                <span className="text-xl">{v.emoji}</span>
                <span className="text-sm">{v.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-center text-sm text-ddak-text/70 mt-4 font-bold">
            v2에서 만나요!
          </p>
          <p className="text-center text-xs text-ddak-text/60 mt-2">
            <a
              href="mailto:hello@mumuclass.kr"
              className="hover:text-ddak-accent transition"
            >
              💌 의견 보내주세요
            </a>
          </p>
        </DdakCard>
      </main>
    </DdakLayout>
  )
}
