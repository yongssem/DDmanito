export const APP_URL = 'https://manito.schoolkok.com/'
export const APP_VERSION = '1.1.1'
// 무무마니또 1.0 운영 배포 dpl_8UPy8boe4vQATnnK8kHZAYoch79p, ready 2026-11-01T15:48:03.757Z.
export const FIRST_DEPLOYED_ON = '2026-11-02'
export const FIRST_DEPLOYMENT_COMMIT = '5fa3c7d69a4a5748803641452374881e055e2275'
const production = typeof import.meta.env !== 'undefined' && import.meta.env.DEPLOY_ENV === 'production'
export const RELEASES = [
  { version: APP_VERSION, date: '2026-11-02', status: production ? 'released' : 'preview', changes: ['파스텔 민트·라벤더·핑크로 화면 색을 바꿨어요.', '기존 푸터를 제거했어요.', '공식 주소를 manito.schoolkok.com으로 연결했어요.'] },
  { version: '1.1.0', date: '2026-11-02', status: 'released', changes: ['친절 미션을 60개로 늘렸어요.', '무무의 대기 호흡과 걷기를 다듬었어요.', '공유·설치 안내·전체화면과 가벼운 이미지로 사용을 편하게 했어요.'] },
  { version: '1.0.0', date: FIRST_DEPLOYED_ON, status: 'released', changes: ['학생별 QR, 엑셀 명단 붙여넣기, 활동 기간과 매일의 비밀 임무로 처음 문을 열었어요.', '도트 마을과 무무 캐릭터, 명단 없는 체험 화면을 선보였어요.'] },
]
