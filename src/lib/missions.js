const DAY_MS = 86400000
export const MAX_ACTIVITY_DAYS = 60

export function todayInSeoul(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export function dateNumber(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN
  const time = Date.parse(`${date}T00:00:00Z`)
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date ? time / DAY_MS : NaN
}

export function addDays(date, days) {
  return new Date((dateNumber(date) + days) * DAY_MS).toISOString().slice(0, 10)
}

export function validatePeriod(start, end) {
  const duration = dateNumber(end) - dateNumber(start) + 1
  if (!Number.isFinite(duration) || duration < 1 || duration > MAX_ACTIVITY_DAYS) {
    throw new Error(`활동 기간은 시작일을 포함해 1~${MAX_ACTIVITY_DAYS}일로 정해주세요.`)
  }
  return duration
}

export const MISSIONS = [
  ['👋', '먼저 인사하기', '오늘 마니또를 만나면 눈을 맞추고 반갑게 인사해요.'],
  ['🔎', '장점 발견하기', '마니또의 좋은 점을 하나 찾아 마음속에 기억해요.'],
  ['💬', '따뜻한 한마디', '마니또에게 진심이 담긴 칭찬 한마디를 전해요.'],
  ['👂', '끝까지 들어주기', '마니또가 말할 때 끼어들지 않고 끝까지 들어봐요.'],
  ['🌱', '작은 배려하기', '줄을 설 때나 이동할 때 마니또에게 작은 배려를 해봐요.'],
  ['🙌', '노력 응원하기', '마니또가 노력하는 모습을 발견하면 응원해요.'],
  ['🧹', '함께 정리하기', '공용 공간을 함께 정리하며 자연스럽게 도와줘요.'],
  ['😊', '미소 건네기', '마니또와 눈이 마주치면 편안한 미소를 건네요.'],
  ['🎨', '취향 알아보기', '대화 속에서 마니또가 좋아하는 것을 하나 알아봐요.'],
  ['🙏', '고마움 전하기', '마니또에게 고마웠던 일을 떠올려 직접 말해요.'],
  ['🤝', '함께 참여하기', '모둠 활동에서 마니또의 생각을 물어봐요.'],
  ['🌤️', '기분 살펴보기', '마니또의 기분을 살펴보고 필요하면 조용히 응원해요.'],
  ['📚', '배운 것 나누기', '수업에서 알게 된 재미있는 사실을 마니또와 나눠요.'],
  ['💪', '도전 응원하기', '마니또가 어려워하는 일에 “할 수 있어!”라고 응원해요.'],
  ['🕊️', '다름 존중하기', '나와 다른 마니또의 생각도 끝까지 존중해요.'],
  ['✨', '성장 찾아주기', '마니또가 전보다 잘하게 된 점을 발견해 말해줘요.'],
  ['🧩', '협력의 손길', '마니또가 도움이 필요한지 먼저 물어봐요.'],
  ['🎵', '즐거움 나누기', '학교에서 있었던 재미있는 이야기를 함께 나눠요.'],
  ['🌼', '친절 이어가기', '마니또에게 받은 친절을 다른 친구에게도 전해요.'],
  ['📝', '응원 문장 만들기', '마니또를 위한 짧은 응원 문장을 마음속으로 만들어요.'],
  ['🍀', '행운 빌어주기', '오늘 마니또의 발표나 도전을 진심으로 응원해요.'],
  ['🛤️', '차례 지켜주기', '마니또가 말하거나 활동할 차례를 잘 지켜줘요.'],
  ['💡', '아이디어 인정하기', '모둠에서 마니또가 낸 좋은 생각을 함께 알아봐요.'],
  ['🎈', '작은 성취 축하하기', '마니또가 해낸 작은 일을 찾아 축하해요.'],
  ['🌿', '편안한 거리 지키기', '마니또가 혼자 있고 싶어 할 때는 그 마음을 존중해요.'],
  ['🫶', '마음을 담아 안부 묻기', '마니또에게 “오늘 어때?”라고 자연스럽게 물어봐요.'],
  ['🧭', '좋은 기억 떠올리기', '함께한 활동 중 가장 즐거웠던 순간을 떠올려요.'],
  ['🏡', '교실을 따뜻하게', '마니또를 포함해 모두가 편안하게 지낼 행동을 해요.'],
  ['💌', '감사 준비하기', '마니또에게 전하고 싶은 감사 한마디를 준비해요.'],
  ['⭐', '우정 돌아보기', '마니또 활동을 하며 내가 배운 배려를 하나 떠올려요.'],
]

export function activityDay(start, end, today = todayInSeoul()) {
  const duration = validatePeriod(start, end)
  const offset = dateNumber(today) - dateNumber(start)
  if (!Number.isFinite(offset)) throw new Error('오늘 날짜를 확인할 수 없어요.')
  if (offset < 0) return { status: 'upcoming', duration, day: 0, remaining: -offset }
  if (offset >= duration) return { status: 'ended', duration, day: duration, remaining: 0 }
  return { status: 'active', duration, day: offset + 1, remaining: duration - offset - 1 }
}

export function missionForDay(day, duration) {
  const [emoji, title, description] = day === duration
    ? ['💌', '마지막 감사 인사', '마니또에게 고마웠던 일을 전해요. 정체 공개는 선생님의 안내에 따라 함께해요.']
    : MISSIONS[(day - 1) % MISSIONS.length]
  return { emoji, title, description }
}
