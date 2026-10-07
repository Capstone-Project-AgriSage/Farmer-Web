import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import WordReveal from './WordReveal'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  linkLabel?: string
  linkTo?: string
  /** "dark" is for sections on the forest green background. */
  tone?: 'light' | 'dark'
  /** Small note shown above the link on the right. */
  children?: ReactNode
}

export default function SectionHeader({ eyebrow, title, description, linkLabel, linkTo, tone = 'light', children }: SectionHeaderProps) {
  const dark = tone === 'dark'
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
      <div className="max-w-2xl">
        <Reveal as="p" y={12} className={`text-[13px] uppercase tracking-[0.16em] mb-3 ${dark ? 'text-white/75' : 'text-text-secondary'}`}>
          {eyebrow}
        </Reveal>
        <h2
          className={`text-[length:var(--type-h2)] leading-[var(--type-h2-lh)] font-normal tracking-tight ${dark ? 'text-white' : 'text-text-primary'}`}
        >
          <WordReveal text={title} inView baseDelay={0.1} />
        </h2>
        {description && (
          <Reveal as="p" delay={0.3} y={16} className={`mt-4 text-base md:text-[17px] leading-relaxed ${dark ? 'text-white/80' : 'text-text-secondary'}`}>
            {description}
          </Reveal>
        )}
      </div>
      {(children || (linkLabel && linkTo)) && (
        <Reveal delay={0.35} y={16} className="flex flex-col sm:items-end gap-1 shrink-0">
          {children}
          {linkLabel && linkTo && (
            <Link
              to={linkTo}
              className={`inline-flex items-center gap-2 min-h-[44px] text-[15px] hover:underline underline-offset-4 ${dark ? 'text-white focus-ring-light' : 'text-text-primary focus-ring'}`}
            >
              {linkLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </Reveal>
      )}
    </div>
  )
}
