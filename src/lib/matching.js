// Fisher-Yates 셔플
function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 입력: [{num, name}, ...] (빈 name은 결번 — 자동 제외)
// 출력: [{num, name, manitoNum}, ...] (num 오름차순)
//
// 알고리즘: 채워진 학생만 셔플 후 원형 매칭. 자기 자신 매칭은 본질적으로 불가능하지만
// 안전망으로 num 일치 검증 + 최대 100회 재시도.
export function matchManito(students) {
  if (!Array.isArray(students)) {
    throw new Error('학생 명단이 올바르지 않아요.')
  }

  const filled = students
    .filter((s) => s && typeof s.name === 'string' && s.name.trim().length > 0)
    .map((s) => ({ num: s.num, name: s.name.trim() }))

  if (filled.length < 2) {
    throw new Error('이름이 채워진 학생이 2명 이상이어야 매칭할 수 있어요.')
  }

  const names = filled.map((s) => s.name)
  if (new Set(names).size !== names.length) {
    throw new Error('학생 명단에 중복된 이름이 있어요.')
  }

  for (let attempt = 0; attempt < 100; attempt++) {
    const order = shuffle(filled)
    const result = []
    let ok = true
    for (let i = 0; i < order.length; i++) {
      const giver = order[i]
      const receiver = order[(i + 1) % order.length]
      if (giver.num === receiver.num) {
        ok = false
        break
      }
      result.push({ num: giver.num, name: giver.name, manitoNum: receiver.num })
    }
    if (ok) {
      result.sort((a, b) => a.num - b.num)
      return result
    }
  }
  throw new Error('매칭에 실패했어요. 다시 시도해 주세요.')
}
