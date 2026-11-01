import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import { loadTeacherActivity, studentLink } from '../lib/activity'

export default function TeacherShare() {
  const { activityId } = useParams()
  return <TeacherShareContent key={activityId} activityId={activityId} />
}

function TeacherShareContent({ activityId }) {
  const navigate = useNavigate()
  const [activity] = useState(() => loadTeacherActivity(activityId))
  async function copyLink(link) {
    try { await navigator.clipboard.writeText(link); toast.success('해당 학생에게만 전달해주세요.') }
    catch { toast.error('복사할 수 없어요. 카드 아래 링크를 직접 복사해주세요.') }
  }
  const guideText = activity ? `우리 반 무무마니또 안내 🎒\n활동 기간: ${activity.start} ~ ${activity.end}\n1. 선생님께 받은 내 QR을 학교 태블릿이나 폰으로 열어요.\n2. 내가 챙겨줄 비밀 친구를 확인해요.\n3. 매일 임무 봉투를 열고 교실에서 실천해요.\n4. 실천한 뒤 같은 기기에서 친절 도장을 받아요.\n내 QR은 다른 친구에게 보여주지 않아요. 집에서 따로 접속할 필요는 없어요.` : ''
  async function copyGuide() {
    try { await navigator.clipboard.writeText(guideText); toast.success('학생 안내문을 복사했어요.') }
    catch { toast.error('복사할 수 없어요. 아래 안내문을 직접 복사해주세요.') }
  }
  return <DdakLayout>
    <div className="print:hidden"><DdakHeader title="학생별 비밀 초대장" subtitle="선생님 전용 · 한 장씩 나눠주세요" emoji="💌" /></div>
    <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-8 print:max-w-none print:p-0">
      {!activity ? <DdakCard>
        <h2 className="text-xl">이 브라우저에 QR 목록이 없어요</h2>
        <p className="text-sm mt-3 leading-relaxed">활동을 만든 브라우저에서 열어주세요. 다른 기기로 옮기거나 사이트 데이터를 지웠다면 QR 목록을 다시 만들 수 없어요. 이미 배부한 학생 QR은 계속 사용할 수 있어요.</p>
        <DdakButton className="mt-5" onClick={() => navigate('/teacher')}>새 활동 만들기</DdakButton>
      </DdakCard> : <>
        <div className="print:hidden mb-6 space-y-4">
          <DdakCard>
            <h2 className="text-xl">{activity.c} · {activity.students.length}장의 초대장</h2>
            <p className="text-sm mt-2">{activity.start} ~ {activity.end} · 한국 시간 기준</p>
            <p className="text-sm leading-relaxed mt-3">QR 전체를 학급 단체방에 올리지 말고, 잘라서 해당 학생에게 한 장씩 주세요. 이 교사용 주소는 활동을 만든 브라우저에서만 열려요.</p>
            <p className="text-xs leading-relaxed mt-2">학생 링크를 가진 사람은 그 학생의 결과를 볼 수 있어요. QR은 비밀번호처럼 보관해주세요. 종이 인쇄나 PDF로 저장해두면 다시 배부할 수 있어요.</p>
          </DdakCard>
          <div className="flex flex-wrap gap-3">
            <DdakButton onClick={() => window.print()}>🖨️ QR 초대장 인쇄 / PDF 저장</DdakButton>
            <DdakButton variant="secondary" onClick={copyGuide}>📋 학생 안내문 복사</DdakButton>
            <DdakButton variant="secondary" onClick={() => navigate('/')}>홈으로</DdakButton>
          </div>
        </div>
        <details className="print:hidden mb-5"><summary className="font-bold cursor-pointer">학생 안내문 보기</summary><pre className="ink-subcard mt-3 p-4 whitespace-pre-wrap text-sm font-pretendard">{guideText}</pre></details>
        <h2 className="hidden print:block text-xl mb-4">{activity.c} · 비밀 친구 초대장</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 print:grid-cols-2 print:gap-3">
          {activity.students.map((student) => {
            const link = studentLink(window.location.origin, activity, student)
            return <article key={student.num} className="qr-invitation ink-subcard p-5 text-center break-inside-avoid">
              <p className="text-xs text-ddak-text/70">{activity.c} · 비밀 친구 탐험</p>
              <h3 className="text-lg mt-2">{student.num}번 {student.name}</h3>
              <div className="my-3 flex justify-center"><QRCodeSVG value={link} size={176} level="M" marginSize={4} fgColor="#333333" title={`${student.num}번 ${student.name} 학생 전용 QR`} /></div>
              <p className="text-xs">{activity.start} ~ {activity.end}</p>
              <p className="text-xs mt-2">내 QR로 입장하고, 매일 작은 친절을 실천해요.</p>
              <p className="text-xs font-bold mt-1">다른 친구에게 QR을 보여주지 마세요 🤫</p>
              <div className="print:hidden mt-4">
                <DdakButton variant="secondary" className="w-full !py-2 !text-sm" onClick={() => copyLink(link)}>{student.num}번 링크 복사</DdakButton>
                <details className="mt-3 text-xs text-left"><summary className="cursor-pointer">링크 직접 복사</summary>
                  <input aria-label={`${student.num}번 학생 링크`} readOnly value={link} onFocus={(e) => e.target.select()} className="ink-field mt-2" />
                </details>
              </div>
            </article>
          })}
        </div>
      </>}
    </main>
  </DdakLayout>
}
