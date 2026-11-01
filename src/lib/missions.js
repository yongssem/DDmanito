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
  ['👋', '작전명: 반가운 눈인사', '마니또와 눈이 마주치면 미소와 함께 먼저 인사해요. 자연스럽게 성공하면 오늘의 작전 완료!'],
  ['🔎', '숨은 장점 탐정', '오늘 마니또에게서 좋은 점 한 가지를 발견해요. 탐정처럼 관찰하되 빤히 쳐다보지는 않기!'],
  ['💬', '칭찬 한 줄 배달', '마니또의 구체적인 행동 하나를 칭찬해요. “아까 끝까지 노력한 거 멋졌어!”처럼 진심을 담아봐요.'],
  ['👂', '경청 레이더 ON', '마니또가 이야기할 때 마지막 문장까지 들어요. 끼어들지 않고 고개를 끄덕여주면 성공!'],
  ['🌱', '양보 요원 출동', '줄 서기나 교실 이동 중 작은 양보 한 번! 친구가 편안해지는 순간을 만들어봐요.'],
  ['🙌', '응원 에너지 충전', '마니또가 도전하는 순간을 찾아 “할 수 있어!” 한마디를 전해요. 결과보다 노력을 응원하기!'],
  ['🧹', '함께 정리 특공대', '공용 공간을 정리할 때 마니또와 힘을 합쳐요. 친구 물건은 허락 없이 만지지 않기!'],
  ['😊', '미소 신호 보내기', '눈이 마주쳤다면 짧게 미소를 건네요. 여러 번 따라다닐 필요 없이 자연스러운 한 번이면 성공!'],
  ['🎨', '취향 보물 찾기', '평소 대화 속에서 마니또가 좋아하는 것을 하나 알아봐요. 말하고 싶어 하지 않으면 다음 기회에!'],
  ['🙏', '고마움 우체부', '마니또에게 고마웠던 일을 찾아 직접 말해요. “아까 알려줘서 고마워” 같은 작은 일도 좋아요.'],
  ['🤝', '아이디어 초대장', '모둠 활동에서 마니또에게 “너는 어떻게 생각해?”라고 물어요. 대답할 시간을 기다려주면 성공!'],
  ['🌤️', '마음 날씨 관측', '마니또가 지쳐 보이면 “괜찮아?”라고 조용히 물어봐요. 혼자 있고 싶다면 그 마음도 존중하기!'],
  ['📚', '발견 공유 퀘스트', '오늘 배운 재미있는 사실 하나를 마니또와 나눠요. 서로 아는 것을 바꿔 이야기해도 좋아요.'],
  ['💪', '도전 응원단', '마니또가 어려운 일을 하고 있다면 “도움이 필요해?”라고 물어요. 괜찮다고 하면 응원만 해줘요.'],
  ['🕊️', '다른 생각 수집가', '나와 다른 마니또의 생각을 하나 들어봐요. “그렇게 생각할 수도 있겠네”라고 존중해주면 성공!'],
  ['✨', '성장 발견 보고서', '마니또가 전보다 잘하게 된 점을 찾아 말해요. 작아 보이는 변화도 멋진 발견이에요.'],
  ['🧩', '협력 퍼즐 맞추기', '함께하는 활동에서 내가 도울 작은 역할 하나를 찾아요. 먼저 물어보고 힘을 보태면 임무 완료!'],
  ['🎵', '웃음 한 조각 나누기', '학교에서 있었던 즐거운 이야기를 나눠요. 누군가를 놀리거나 곤란하게 만드는 이야기는 제외!'],
  ['🌼', '친절 릴레이 출발', '마니또에게 받은 친절을 다른 친구에게도 전해요. 우리 반에 친절 한 칸이 더 생기면 성공!'],
  ['📝', '응원 문장 제작소', '마니또를 위한 짧은 응원 문장을 만들고 자연스럽게 말해요. 거창하지 않아도 진심이면 충분해요.'],
  ['🍀', '행운 버프 보내기', '발표나 도전 앞에 선 마니또에게 조용히 응원을 전해요. 부담을 주지 않는 짧은 한마디면 좋아요.'],
  ['🛤️', '차례 지킴이', '마니또가 말하거나 활동할 차례를 지켜줘요. 친구의 시간이 온전히 이어지면 오늘의 미션 성공!'],
  ['💡', '반짝 아이디어 구조대', '마니또가 낸 좋은 생각을 발견하면 “그 생각 좋다!”라고 인정해줘요. 생각의 주인이 누구인지도 함께 말해요.'],
  ['🎈', '작은 성공 축하단', '마니또가 해낸 작은 일을 찾아 축하해요. 다른 친구와 비교하지 않고 그 친구의 성취만 바라봐요.'],
  ['🌿', '편안한 거리 수호자', '친구에게 필요한 거리를 지켜줘요. 혼자만의 시간이 필요할 때 조용히 기다려주는 것도 멋진 친절이에요.'],
  ['🫶', '안부 신호 수신 중', '마니또에게 “오늘 어때?”라고 물어봐요. 대답을 강요하지 않고 들을 준비를 해주면 성공!'],
  ['🧭', '우정 기억 탐험', '함께한 활동 중 즐거웠던 순간 하나를 떠올려요. 자연스러운 때에 “그때 재미있었지!”라고 나눠봐요.'],
  ['🏡', '따뜻한 교실 건설단', '마니또를 포함해 모두가 편안해질 행동을 하나 실천해요. 공용 공간 정리나 차분한 말하기도 좋아요.'],
  ['💌', '감사 메시지 준비', '마니또에게 전할 감사 한마디를 준비해요. 선물이나 돈 없이, 고마웠던 일을 구체적으로 떠올려봐요.'],
  ['⭐', '다정함 탐험 기록', '이번 활동에서 내가 배운 배려 하나를 떠올려요. 내일도 이어가고 싶은 친절을 마음에 저장하면 성공!'],
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
