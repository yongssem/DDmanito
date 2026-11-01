import { useEffect, useState } from 'react'
import motions from '../../assets/mumu-motions.json'

export default function PixelGuide({ className = '', celebrate = false, motion = 'idle' }) {
  const animation = motions[motion] || motions.idle
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer
    let frame = 0
    const advance = () => {
      frame = (frame + 1) % animation.frames.length
      setIndex(frame)
      timer = window.setTimeout(advance, animation.durations[frame])
    }
    const restart = () => {
      window.clearTimeout(timer)
      frame = 0
      setIndex(0)
      if (!reduced.matches && !document.hidden) timer = window.setTimeout(advance, animation.durations[0])
    }
    reduced.addEventListener('change', restart)
    document.addEventListener('visibilitychange', restart)
    restart()
    return () => { window.clearTimeout(timer); reduced.removeEventListener('change', restart); document.removeEventListener('visibilitychange', restart) }
  }, [animation])
  const frame = animation.frames[index % animation.frames.length]
  const positionX = animation.sheetWidth === frame.w ? 0 : frame.x / (animation.sheetWidth - frame.w) * 100
  const positionY = animation.sheetHeight === frame.h ? 0 : frame.y / (animation.sheetHeight - frame.h) * 100
  return <span role="img" aria-label={celebrate ? '기뻐하는 무무 탐험대장' : motion === 'walk' ? '걷고 있는 무무 탐험대장' : '숨 쉬며 기다리는 무무 탐험대장'} data-motion={motion} data-frame={index} className={`pixel-guide ${celebrate ? 'pixel-guide--cheer' : ''} ${className}`}>
    <span className="pixel-guide-sprite" aria-hidden="true" style={{ backgroundImage: `url(${animation.src})`, backgroundSize: `${animation.sheetWidth / frame.w * 100}% ${animation.sheetHeight / frame.h * 100}%`, backgroundPosition: `${positionX}% ${positionY}%` }} />
  </span>
}
