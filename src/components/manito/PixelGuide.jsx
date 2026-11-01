export default function PixelGuide({ className = '', celebrate = false }) {
  return <span role="img" aria-label={celebrate ? '기뻐하는 무무 탐험대장' : '걷고 있는 무무 탐험대장'} className={`pixel-guide ${celebrate ? 'pixel-guide--cheer' : ''} ${className}`}>
    <span className="pixel-guide-sprite" aria-hidden="true" />
  </span>
}
