import { encodeMatching, decodeMatching } from './encode.js'
import { validateRoster } from './roster.js'
import { validatePeriod, dateNumber } from './missions.js'

const teacherKey = (id) => `ddakmanito:teacher:v2:${id}`
const validLabel = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max
const validPerson = (person) => Array.isArray(person) && person.length === 2 &&
  Number.isInteger(person[0]) && person[0] >= 1 && person[0] <= 999 && validLabel(person[1], 30)

export function isStudentActivity(data) {
  if (!data || data.v !== 2 || !validLabel(data.id, 80) || !validLabel(data.c, 60) ||
      !validPerson(data.p) || !validPerson(data.t) || data.p[0] === data.t[0]) return false
  try {
    validatePeriod(data.start, data.end)
    return true
  } catch { return false }
}

export function saveTeacherActivity(activity) {
  validateRoster(activity.students)
  validatePeriod(activity.start, activity.end)
  localStorage.setItem(teacherKey(activity.id), JSON.stringify(activity))
  try { localStorage.setItem('ddakmanito:last-teacher', activity.id) } catch { /* QR 목록은 이미 저장됨 */ }
}

export function loadTeacherActivity(id) {
  try {
    const data = JSON.parse(localStorage.getItem(teacherKey(id)))
    if (!data || data.v !== 2 || data.id !== id || !validLabel(data.c, 60)) return null
    validateRoster(data.students)
    validatePeriod(data.start, data.end)
    if (data.students.length < 2 || data.students.some((s) => !s.name.trim() ||
        s.manitoNum === s.num || !data.students.some((target) => target.num === s.manitoNum)) ||
        new Set(data.students.map((s) => s.manitoNum)).size !== data.students.length) return null
    return data
  } catch { return null }
}

export function lastTeacherActivity() {
  try {
    const id = localStorage.getItem('ddakmanito:last-teacher')
    return id && loadTeacherActivity(id) ? id : null
  } catch { return null }
}

export function studentPayload(activity, student) {
  const target = activity.students.find((s) => s.num === student.manitoNum)
  // 전체 명단과 역방향 매칭은 학생 링크에 절대 포함하지 않는다.
  const data = { v: 2, id: activity.id, c: activity.c, p: [student.num, student.name],
    t: [target?.num, target?.name], start: activity.start, end: activity.end }
  if (!isStudentActivity(data)) throw new Error('학생별 링크를 만들 수 없어요.')
  return data
}

export function studentLink(origin, activity, student) {
  return `${origin}/s#${encodeMatching(studentPayload(activity, student))}`
}

export function decodeStudentActivity(hash) {
  if (typeof hash !== 'string' || hash.length > 8192) return null
  const data = decodeMatching(hash.replace(/^#/, ''))
  return isStudentActivity(data) ? data : null
}

export const progressKey = (data) => `ddakmanito:progress:v2:${data.id}:${data.p[0]}`

export function readProgress(data, today) {
  try {
    const stored = JSON.parse(localStorage.getItem(progressKey(data)))
    return [...new Set(Array.isArray(stored) ? stored.filter((day) => Number.isFinite(dateNumber(day)) &&
      day >= data.start && day <= data.end && day <= today) : [])].sort()
  } catch { return [] }
}
