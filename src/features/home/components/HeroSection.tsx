import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { m, useScroll, useTransform } from 'framer-motion'
import Magnetic from '../../../components/ui/Magnetic'
import WordReveal from '../../../components/ui/WordReveal'
import { setHeroVisible } from '../../../components/layout/heroSignal'
import { useMotionPolicy, type MotionPolicy } from '../../../motion/useMotionPolicy'
import { useMediaQuery } from '../../../motion/useMediaQuery'
import { DURATION, EASE } from '../../../motion/tokens'

/** Aerial rice paddies, Mixkit free license. Only played with full motion; other policies show the poster photo. */
const HERO_VIDEO_URL = 'https://assets.mixkit.co/videos/13001/13001-720.mp4'
const HERO_LINES = ['Một hệ thống thống nhất', 'để mua, chẩn đoán', 'và chăm sóc vụ lúa']
const HEADER_HEIGHT = 80
// Index of the first word of each headline line, so the word stagger runs across the whole headline.
const WORD_OFFSETS = HERO_LINES.map((_, i) => HERO_LINES.slice(0, i).reduce((n, l) => n + l.split(' ').length, 0))

/** One entrance step. full: staggered by delay. reduced: everything fades up together once. none: static. */
function HeroItem({ policy, delay, duration, className, children }: { policy: MotionPolicy; delay: number; duration: number; className?: string; children: ReactNode }) {
  if (policy === 'none') return <div className={className}>{children}</div>
  const full = policy === 'full'
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: full ? 16 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: full ? duration : DURATION.standard, delay: full ? delay : 0, ease: [...EASE.out] }}
    >
      {children}
    </m.div>
  )
}

/** Moves the hero photo up to ~7% of the hero height while scrolling. Only mounted for desktop with full motion. */
function ParallaxLayer({ targetRef, children }: { targetRef: RefObject<HTMLElement | null>; children: ReactNode }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])
  return (
    <m.div className="absolute inset-x-0 -top-[8%] -bottom-[8%]" style={{ y }}>
      {children}
    </m.div>
  )
}

export default function HeroSection() {
  const policy = useMotionPolicy()
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')
  const sectionRef = useRef<HTMLElement>(null)
  const full = policy === 'full'
  // The video fades in once it has a frame to show; until then the hero is plain cream (no poster photo flashing first).
  const [videoReady, setVideoReady] = useState(false)
  const parallax = full && isLargeScreen

  // Tell the header when the hero has scrolled out from under it.
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`,
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
      setHeroVisible(true)
    }
  }, [])

  const photo = full ? (
    <video
      src={HERO_VIDEO_URL}
      ref={(el) => {
        if (el && el.readyState >= 2) setVideoReady(true)
      }}
      onLoadedData={() => setVideoReady(true)}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
    />
  ) : (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet="/images/misc/hero-rice-field-m-640.webp 640w, /images/misc/hero-rice-field-m-960.webp 960w"
        sizes="100vw"
        type="image/webp"
      />
      <source
        srcSet="/images/misc/hero-rice-field-640.webp 640w, /images/misc/hero-rice-field-1280.webp 1280w, /images/misc/hero-rice-field-1920.webp 1920w"
        sizes="100vw"
        type="image/webp"
      />
      <img
        src="/images/misc/hero-rice-field.jpg"
        width={1920}
        height={814}
        alt="Cánh đồng lúa xanh lúc bình minh, có người đang làm việc trên ruộng"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-[55%_85%] md:object-[50%_75%]"
      />
    </picture>
  )

  return (
    <section ref={sectionRef} className="relative w-full min-h-[88svh] lg:min-h-[min(100svh,960px)] flex items-center overflow-hidden bg-brand-cream">
      <div className="absolute inset-0">
        {parallax ? (
          <ParallaxLayer targetRef={sectionRef}>
            <ScaleIn>{photo}</ScaleIn>
          </ParallaxLayer>
        ) : full ? (
          <ScaleIn>{photo}</ScaleIn>
        ) : (
          photo
        )}
      </div>

      {/* Cream wash so the copy stays readable over the photo, fading into the section below. */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-brand-cream/90 via-brand-cream/70 to-brand-cream/20 md:bg-gradient-to-r md:from-brand-cream ${
          full ? 'md:via-brand-cream/80 md:to-brand-cream/15' : 'md:via-brand-cream/55 md:via-40% md:to-transparent'
        }`}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-cream to-transparent" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 md:pt-32 pb-20 flex flex-col items-start">
        <HeroItem policy={policy} delay={0.15} duration={0.45}>
          <Link
            to="/ai-doctor"
            className="focus-ring inline-flex items-center gap-2 min-h-[44px] py-2 px-4 rounded-full border border-brand-dark/20 bg-white/90 hover:bg-white transition-colors"
          >
            <span className="text-sm font-medium text-brand-dark">Chẩn đoán bệnh lúa AI · Miễn phí hôm nay</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-dark" aria-hidden="true" />
          </Link>
        </HeroItem>

        <HeroItem policy={policy === 'full' ? 'none' : policy} delay={0} duration={0} className="mt-6 md:mt-8 max-w-5xl">
          <h1 className="text-left text-[length:var(--type-display)] leading-[var(--type-display-lh)] text-brand-dark tracking-tight font-hero font-light italic">
            {HERO_LINES.map((line, index) => (
              <span key={line} className="inline md:block">
                <WordReveal text={line} baseDelay={0.2} stagger={0.035} duration={0.8} startIndex={WORD_OFFSETS[index]} />{' '}
              </span>
            ))}
          </h1>
        </HeroItem>

        <HeroItem policy={policy} delay={0.7} duration={0.45} className="mt-6 md:mt-8 max-w-xl">
          <p className="text-left text-base md:text-lg text-text-secondary leading-relaxed">
            Vật tư chính hãng, bác sĩ cây trồng AI và sổ nợ — mọi thứ nhà nông cần trên một nền tảng.
          </p>
        </HeroItem>

        <HeroItem policy={policy} delay={0.85} duration={0.4} className="mt-8 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
            <Magnetic>
            <Link
              to="/products"
              className="focus-ring inline-flex items-center justify-center min-h-[48px] px-7 bg-brand-dark text-white text-[15px] tracking-wide rounded-full hover:bg-brand-green transition-colors"
            >
              Khám phá vật tư
            </Link>
            </Magnetic>
            <Magnetic>
            <Link
              to="/ai-doctor"
              className="focus-ring inline-flex items-center justify-center gap-2 min-h-[48px] px-7 border border-brand-dark/30 bg-white/40 text-brand-dark text-[15px] tracking-wide rounded-full hover:bg-white/80 transition-colors"
            >
              Chẩn đoán AI
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            </Magnetic>
          </div>
        </HeroItem>
      </div>
    </section>
  )
}

/** Photo settles from 1.07 to 1 as the page opens. */
function ScaleIn({ children }: { children: ReactNode }) {
  return (
    <m.div className="absolute inset-0" initial={{ scale: 1.07 }} animate={{ scale: 1 }} transition={{ duration: 1.3, ease: [...EASE.out] }}>
      {children}
    </m.div>
  )
}
