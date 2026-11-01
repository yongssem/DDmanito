import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRoster, validateRoster } from '../src/lib/roster.js'
import { matchManito } from '../src/lib/matching.js'
import { todayInSeoul, dateNumber, addDays, validatePeriod, activityDay, missionForDay, MISSIONS } from '../src/lib/missions.js'
import { studentPayload, studentLink, decodeStudentActivity, saveTeacherActivity, loadTeacherActivity, readProgress, progressKey } from '../src/lib/activity.js'
import { encodeMatching, decodeMatching } from '../src/lib/encode.js'

const students = [{ num: 1, name: '가람' }, { num: 3, name: '가람' }, { num: 7, name: '다온' }]
const activity = { v: 2, id: 'activity-unique-id', c: '햇살반', start: '2026-11-01', end: '2026-11-14',
  students: [{ ...students[0], manitoNum: 3 }, { ...students[1], manitoNum: 7 }, { ...students[2], manitoNum: 1 }] }
const storage = new Map()
globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }

test('엑셀 탭·CRLF·헤더·결번·동명이인을 보존한다', () => {
  assert.deepEqual(parseRoster('출석번호\t이름\r\n1\t가람\r\n3\t가람\r\n7\t다온'), students)
  assert.deepEqual(parseRoster('이름\n가람\n\n다온'), [{ num: 1, name: '가람' }, { num: 2, name: '' }, { num: 3, name: '다온' }])
  assert.deepEqual(parseRoster('1\t가람\n2\t\n3\t다온'), [{ num: 1, name: '가람' }, { num: 2, name: '' }, { num: 3, name: '다온' }])
})

test('잘못된 표는 부분 적용하지 않고 거부한다', () => {
  for (const text of ['', '이름', '가람', '1\t가람\n1\t다온', '0\t가람\n2\t다온', '1\t가람\t비고\n2\t다온\t비고', 'x\t가람\n2\t다온', '1\t가람\n다온', '1\t' + '가'.repeat(31) + '\n2\t다온']) {
    assert.throws(() => parseRoster(text), undefined, text)
  }
  assert.throws(() => validateRoster(Array.from({ length: 101 }, (_, i) => ({ num: i + 1, name: '가람' }))))
})

test('매칭은 결번을 제외하고 동명이인도 번호로 구분한다', () => {
  for (let run = 0; run < 100; run++) {
    const result = matchManito([...students, { num: 8, name: ' ' }])
    assert.equal(result.length, 3)
    assert.deepEqual(result.map((s) => s.num), [1, 3, 7])
    assert.equal(new Set(result.map((s) => s.manitoNum)).size, 3)
    assert.ok(result.every((s) => s.num !== s.manitoNum && students.some((t) => t.num === s.manitoNum)))
  }
  assert.throws(() => matchManito([{ num: 1, name: '가람' }]))
  assert.throws(() => matchManito([{ num: 1, name: '가람' }, { num: 1, name: '다온' }]))
})

test('한국 자정 경계와 윤년을 정확하게 계산한다', () => {
  assert.equal(todayInSeoul(new Date('2026-10-31T14:59:59Z')), '2026-10-31')
  assert.equal(todayInSeoul(new Date('2026-10-31T15:00:00Z')), '2026-11-01')
  assert.equal(addDays('2028-02-28', 1), '2028-02-29')
  assert.ok(Number.isNaN(dateNumber('2026-02-30')))
  assert.equal(validatePeriod('2026-11-01', '2026-12-30'), 60)
  assert.throws(() => validatePeriod('2026-11-02', '2026-11-01'))
  assert.throws(() => validatePeriod('2026-11-01', '2026-12-31'))
  assert.throws(() => validatePeriod('', '2026-11-01'))
})

test('활동 전·첫날·마지막 날·종료 후를 구분한다', () => {
  assert.equal(activityDay(activity.start, activity.end, '2026-10-31').status, 'upcoming')
  assert.equal(activityDay(activity.start, activity.end, '2026-11-01').day, 1)
  assert.equal(activityDay(activity.start, activity.end, '2026-11-14').remaining, 0)
  assert.equal(activityDay(activity.start, activity.end, '2026-11-14').status, 'active')
  assert.equal(activityDay(activity.start, activity.end, '2026-11-15').status, 'ended')
  assert.equal(activityDay(activity.start, activity.start, activity.start).duration, 1)
  assert.equal(MISSIONS.length, 30)
  assert.equal(missionForDay(1, 14).title, missionForDay(1, 14).title)
  assert.equal(missionForDay(14, 14).title, '마지막 감사 인사')
  assert.ok(missionForDay(59, 60).title)
})

test('학생 QR에는 본인·상대 한 쌍만 포함하고 전체 명단·역방향 결과를 넣지 않는다', () => {
  const payload = studentPayload(activity, activity.students[0])
  assert.deepEqual(Object.keys(payload).sort(), ['v', 'id', 'c', 'p', 't', 'start', 'end'].sort())
  assert.deepEqual(payload.p, [1, '가람'])
  assert.deepEqual(payload.t, [3, '가람'])
  assert.ok(!JSON.stringify(payload).includes('다온'))
  const url = new URL(studentLink('https://example.com', activity, activity.students[0]))
  assert.equal(url.pathname, '/s')
  assert.equal(url.search, '')
  assert.deepEqual(decodeStudentActivity(url.hash), payload)
  assert.notEqual(studentLink('https://example.com', activity, activity.students[0]), studentLink('https://example.com', activity, activity.students[1]))
})

test('손상되거나 타입·기간이 잘못된 학생 링크는 화면에 전달하지 않는다', () => {
  const payload = studentPayload(activity, activity.students[0])
  for (const value of [null, 'broken', '#', '#a'.repeat(9000), '#' + encodeMatching({ ...payload, t: payload.p }),
    '#' + encodeMatching({ ...payload, start: '2026-02-30' }), '#' + encodeMatching({ ...payload, t: ['3', '가람'] }),
    '#' + encodeMatching({ c: '예전반', s: [[1, '가람']], m: [1] })]) {
    assert.equal(decodeStudentActivity(value), null)
  }
})

test('기존 공통 링크의 압축 형식도 계속 해석된다', () => {
  const legacy = { c: '예전반', s: [[1, '가람'], [2, '다온']], m: [2, 1] }
  assert.deepEqual(decodeMatching(encodeMatching(legacy)), legacy)
})

test('교사 명단은 브라우저에서 복구되며 잘못된 저장 데이터는 거부한다', () => {
  saveTeacherActivity(activity)
  assert.deepEqual(loadTeacherActivity(activity.id), activity)
  assert.equal(loadTeacherActivity('other-id'), null)
  storage.set(`ddakmanito:teacher:v2:broken`, '{')
  assert.equal(loadTeacherActivity('broken'), null)
})

test('도장은 활동·학생별로 분리하고 중복·기간 밖·미래 기록을 제외한다', () => {
  const payload = studentPayload(activity, activity.students[0])
  const other = studentPayload(activity, activity.students[1])
  assert.notEqual(progressKey(payload), progressKey(other))
  storage.set(progressKey(payload), JSON.stringify(['2026-11-01', '2026-11-01', '2026-11-03', '2026-10-31', null, '2026-02-30']))
  assert.deepEqual(readProgress(payload, '2026-11-02'), ['2026-11-01'])
  assert.deepEqual(readProgress(other, '2026-11-02'), [])
  storage.set(progressKey(payload), '{')
  assert.deepEqual(readProgress(payload, '2026-11-02'), [])
})

test('엑셀의 마지막 빈 이름과 맨 앞 결번도 보존한다', () => {
  assert.deepEqual(parseRoster('1\t가람\n2\t다온\n3\t\n'), [{ num: 1, name: '가람' }, { num: 2, name: '다온' }, { num: 3, name: '' }])
  assert.deepEqual(parseRoster('\n가람\n다온'), [{ num: 1, name: '' }, { num: 2, name: '가람' }, { num: 3, name: '다온' }])
})
