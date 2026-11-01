import confetti from 'canvas-confetti'

// 무무마니또 폭죽: 잉크 UI 4색으로 마니또 공개 순간 연출
const DDAK_COLORS = ['#237E7F', '#E8EFDA', '#FFFAEF', '#342C21']

export function trigger() {
  confetti({
    disableForReducedMotion: true,
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: DDAK_COLORS,
  })
}

// UI 렌더링 없는 유틸 컴포넌트 — default도 함께 export 해 import 방식 자유롭게
export default { trigger }
