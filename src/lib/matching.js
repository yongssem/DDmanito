import { validateRoster } from './roster.js'

export function matchManito(students) {
  validateRoster(students)
  const filled = students.filter((s) => s.name.trim()).map((s) => ({ num: s.num, name: s.name.trim() }))
  if (filled.length < 2) throw new Error('이름이 채워진 학생이 2명 이상이어야 매칭할 수 있어요.')
  const order = filled.slice()
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  // 출석번호가 고유한 학생을 원형으로 연결해 자기 자신과 중복 배정을 막는다.
  return order.map((s, i) => ({ ...s, manitoNum: order[(i + 1) % order.length].num }))
    .sort((a, b) => a.num - b.num)
}
