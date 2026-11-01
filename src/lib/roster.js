export const MAX_STUDENTS = 100

export function validateRoster(students) {
  if (!Array.isArray(students) || students.length > MAX_STUDENTS) {
    throw new Error(`명단은 ${MAX_STUDENTS}명까지 입력할 수 있어요.`)
  }
  const seen = new Set()
  for (const student of students) {
    if (!student || !Number.isInteger(student.num) || student.num < 1 || student.num > 999) {
      throw new Error('출석번호는 1~999 사이의 정수로 입력해주세요.')
    }
    if (seen.has(student.num)) throw new Error(`${student.num}번이 중복되었어요.`)
    if (typeof student.name !== 'string' || student.name.trim().length > 30) {
      throw new Error('이름은 30자 이내로 입력해주세요.')
    }
    seen.add(student.num)
  }
  return students
}

// 엑셀의 탭 구분 표와 이름 한 열을 받는다. 출석번호가 있으면 결번을 보존한다.
export function parseRoster(text) {
  if (!text.trim()) throw new Error('엑셀에서 복사한 명단을 붙여넣어주세요.')
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/\n+$/, '').split('\n')
  const rows = lines.map((line) => line.split('\t').map((cell) => cell.trim()))
  const header = rows[0]
  if ((header.length === 1 && /^(이름|성명|학생명)$/.test(header[0])) ||
      (header.length === 2 && /^(번호|출석번호|출석 번호)$/.test(header[0]) && /^(이름|성명|학생명)$/.test(header[1]))) {
    rows.shift()
  }
  if (!rows.length) throw new Error('제목 아래에 학생 명단을 넣어주세요.')
  const hasNumbers = rows.some((row) => row.length === 2)
  const students = rows.map((row, index) => {
    if (row.length !== (hasNumbers ? 2 : 1)) {
      throw new Error('이름 한 열 또는 번호·이름 두 열만 복사해주세요.')
    }
    if (hasNumbers && !/^\d{1,3}$/.test(row[0])) {
      throw new Error(`${index + 1}번째 줄의 출석번호를 확인해주세요.`)
    }
    return { num: hasNumbers ? Number(row[0]) : index + 1, name: row[hasNumbers ? 1 : 0] }
  })
  validateRoster(students)
  if (students.filter((s) => s.name).length < 2) throw new Error('학생 이름이 2명 이상 필요해요.')
  return students.sort((a, b) => a.num - b.num)
}
