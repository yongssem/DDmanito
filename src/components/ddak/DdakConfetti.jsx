import confetti from 'canvas-confetti'

// 뚝딱 시리즈 폭죽: 파스텔 4색으로 마니또 공개 순간 연출
const DDAK_COLORS = ['#FFD6E0', '#C8E6F5', '#E8D5F2', '#FF8FA3']

export function trigger() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: DDAK_COLORS,
  })
}

// UI 렌더링 없는 유틸 컴포넌트 — default도 함께 export 해 import 방식 자유롭게
export default { trigger }
