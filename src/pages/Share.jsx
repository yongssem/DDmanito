import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { Copy, ShareNetwork, ArrowLeft } from '@phosphor-icons/react'
import DdakLayout from '../components/ddak/DdakLayout'
import DdakHeader from '../components/ddak/DdakHeader'
import DdakCard from '../components/ddak/DdakCard'
import DdakButton from '../components/ddak/DdakButton'
import DdakInput from '../components/ddak/DdakInput'
import { decodeMatching } from '../lib/encode'

export default function Share() {
  const { encoded } = useParams()
  const navigate = useNavigate()

  // 디코딩은 한 번만 — 매칭 정보(m)는 여기서 절대 화면에 노출하지 않음(교사도 볼 필요 없음)
  const data = useMemo(() => decodeMatching(encoded), [encoded])
  const studentLink = `${window.location.origin}/r/${encoded}`

  if (!data || !data.m || !data.c) {
    return (
      <DdakLayout>
        <DdakHeader title="잘못된 링크" subtitle="공유 링크를 다시 확인해주세요" emoji="⚠️" />
        <main className="flex-1 max-w-md mx-auto w-full px-6 py-10">
          <DdakCard delay={0.2}>
            <p className="text-center leading-relaxed">
              링크가 손상되었거나 디코딩할 수 없어요.<br />
              <span className="text-sm opacity-70">새로 매칭을 만들어주세요.</span>
            </p>
          </DdakCard>
          <div className="mt-8">
            <DdakButton variant="secondary" className="w-full" onClick={() => navigate('/teacher')}>
              ← 새로 만들기
            </DdakButton>
          </div>
        </main>
      </DdakLayout>
    )
  }

  const studentCount = Object.keys(data.m).length

  // Web Share API는 모바일/Safari에서만 — 데스크톱 크롬에서는 보이지 않게 분기
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(studentLink)
      toast.success('복사됐어요! 학생들에게 붙여넣기 해주세요 💌')
    } catch {
      toast.error('복사에 실패했어요. 직접 선택해 주세요.')
    }
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: '뚝딱마니또 🌸',
        text: '우리 반 마니또를 확인해보세요!',
        url: studentLink,
      })
    } catch {
      // 사용자가 공유 시트를 닫은 경우 — 에러 토스트 띄우지 않음
    }
  }

  return (
    <DdakLayout>
      <DdakHeader title="🎉 매칭 완료!" subtitle="학생들에게 공유하세요" emoji="📤" />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-10 space-y-5">
        {/* Card 1 — 요약 */}
        <DdakCard delay={0.2}>
          <h2 className="font-ssurround text-2xl text-center text-ddak-text">{data.c}</h2>
          <p className="text-center text-sm text-ddak-text/70 mt-2">
            총 <span className="font-bold text-ddak-accent">{studentCount}</span>명의 마니또가 정해졌어요
          </p>
        </DdakCard>

        {/* Card 2 — QR 코드 */}
        <DdakCard delay={0.3}>
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-2xl">
              <QRCodeSVG value={studentLink} size={220} fgColor="#FF8FA3" bgColor="#FFFFFF" />
            </div>
          </div>
          <p className="text-center text-sm text-ddak-text/70 mt-4">
            📱 QR로 바로 입장
          </p>
        </DdakCard>

        {/* Card 3 — 링크 복사 */}
        <DdakCard delay={0.4}>
          <p className="text-sm text-ddak-text/70 mb-3 text-center">공유 링크</p>
          <DdakInput value={studentLink} onChange={() => {}} readOnly />
          <div className="mt-4">
            <DdakButton variant="primary" className="w-full" onClick={handleCopy}>
              <span className="flex items-center justify-center gap-2">
                <Copy size={20} weight="bold" />
                복사하기
              </span>
            </DdakButton>
          </div>
          {canShare && (
            <div className="mt-3">
              <DdakButton variant="secondary" className="w-full" onClick={handleShare}>
                <span className="flex items-center justify-center gap-2">
                  <ShareNetwork size={20} weight="bold" />
                  OS 공유
                </span>
              </DdakButton>
            </div>
          )}
        </DdakCard>

        {/* Card 4 — 안내 */}
        <DdakCard delay={0.5}>
          <p className="font-bombom text-2xl text-center text-ddak-accent leading-relaxed">
            학생들이 이 링크나 QR로 들어가<br />
            자기 이름을 누르면<br />
            마니또를 확인할 수 있어요 🎁
          </p>
        </DdakCard>

        <div className="pt-2">
          <DdakButton variant="secondary" className="w-full" onClick={() => navigate('/teacher')}>
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft size={20} weight="bold" />
              새로 만들기
            </span>
          </DdakButton>
        </div>
      </main>
    </DdakLayout>
  )
}
