import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

// 떠다니는 입자: 15개 고정 — 무드가 산만해지지 않도록 절대 늘리지 말 것
const PARTICLE_OPTIONS = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: { value: 15 },
    color: { value: ['#FFD6E0', '#E8D5F2'] }, // ddak.pink, ddak.lavender
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.4, max: 0.7 },
    },
    size: {
      value: { min: 4, max: 10 },
    },
    move: {
      enable: true,
      speed: { min: 1, max: 2 },
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'out' },
    },
  },
}

export default function DdakParticles() {
  // tsparticles v3는 엔진을 한 번만 초기화 후 ready 플래그로 렌더 시작
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setReady(true))
  }, [])

  const options = useMemo(() => PARTICLE_OPTIONS, [])

  if (!ready) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles id="ddak-particles" options={options} />
    </div>
  )
}
