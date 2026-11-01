import DdakCard from './ddak/DdakCard'
import { RELEASES, FIRST_DEPLOYED_ON } from '../lib/releases'

export default function ReleaseNotes() {
  const [latest, ...older] = RELEASES
  return <DdakCard>
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl">앱 업데이트 내역</h2><span className="ink-badge">{latest.version} · {latest.status === 'released' ? '배포됨' : '배포 전 미리보기'}</span></div>
    <p className="text-xs mt-3">{latest.date}</p>
    <ul className="list-disc pl-5 space-y-2 mt-3 text-sm">{latest.changes.map((change) => <li key={change}>{change}</li>)}</ul>
    <details className="mt-5"><summary className="cursor-pointer text-sm font-bold">이전 업데이트 보기</summary>
      {older.map((release) => <div key={release.version} className="ink-subcard p-4 mt-3"><h3 className="text-sm">{release.version} · {release.date}</h3><ul className="list-disc pl-5 mt-3 space-y-2 text-sm">{release.changes.map((change) => <li key={change}>{change}</li>)}</ul></div>)}
    </details>
    <p className="text-xs mt-5">무무마니또 최초 배포일 · {FIRST_DEPLOYED_ON}</p>
  </DdakCard>
}
