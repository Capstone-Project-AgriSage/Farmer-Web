import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'

// The four service commitments, as a running band. The same text is spelled out in the commitments section below.
const PHRASES = ['100% Chính hãng', 'Bảo lãnh nợ', 'Giao nhanh tận ruộng', 'Kỹ sư nông học 24/7']

function Phrases() {
  return (
    <>
      {PHRASES.map((phrase) => (
        <span key={phrase} className="flex items-center gap-8 pr-8">
          <span>{phrase}</span>
          <span aria-hidden="true">✦</span>
        </span>
      ))}
    </>
  )
}

export default function MarqueeBand() {
  const full = useMotionPolicy() === 'full'
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useInView(ref, { margin: '100px' })

  return (
    <div aria-hidden="true" className="relative z-10 -mt-6 md:-mt-10 py-10 md:py-14 overflow-hidden pointer-events-none">
      <div ref={ref} className={`bg-brand-dark text-white py-4 md:py-5 ${full ? '-rotate-[2.5deg] -mx-10' : ''}`}>
        {full ? (
          <div
            className="marquee-track text-3xl md:text-4xl font-light tracking-tight whitespace-nowrap"
            style={{ animationPlayState: onScreen ? 'running' : 'paused' }}
          >
            <Phrases />
            <Phrases />
            <Phrases />
            <Phrases />
          </div>
        ) : (
          <div className="px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-lg font-light">
            <Phrases />
          </div>
        )}
      </div>
    </div>
  )
}
