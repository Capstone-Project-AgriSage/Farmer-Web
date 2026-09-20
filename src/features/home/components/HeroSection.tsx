import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Aerial rice paddies — Mixkit free license, fits AgriSage agriculture branding */
const HERO_VIDEO_URL =
  'https://assets.mixkit.co/videos/13001/13001-720.mp4'

const partners = [
  { name: 'Syngenta', className: 'font-playfair' },
  { name: 'Bình Điền', className: 'font-oswald uppercase' },
  { name: 'Cà Mau', className: 'font-montserrat' },
  { name: 'VietGAP', className: 'font-roboto-slab uppercase' },
  { name: 'Hai Thắng', className: 'font-raleway' },
] as const

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream">
      <div className="absolute inset-0">
        <video
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/misc/hero-rice-field.jpg"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Soft cream wash: readable copy + visual bridge into homepage */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/85 to-brand-cream/10 md:via-brand-cream/75 md:to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-cream to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-24 md:pt-32 px-6 lg:px-8 pb-16">
        <Link
          to="/ai-doctor"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/20 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors mb-5 md:mb-6 animate-fade-up stagger-3 shadow-sm"
        >
          <span className="text-sm font-medium text-brand-dark">
            Chẩn đoán bệnh lúa AI · Miễn phí hôm nay
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-dark" />
        </Link>

        <h1 className="text-left text-5xl sm:text-6xl md:text-7xl lg:text-[80px] text-brand-dark leading-[1.05] tracking-tight max-w-5xl font-hero font-light animate-fade-up stagger-4">
          Một hệ thống thống nhất
          <br className="hidden md:block" />{' '}
          để mua, chẩn đoán
          <br className="hidden md:block" />{' '}
          và chăm sóc vụ lúa
        </h1>

        <p className="mt-6 md:mt-8 max-w-xl text-left text-base md:text-lg text-brand-dark/75 leading-relaxed font-sans animate-fade-up stagger-4">
          Vật tư chính hãng, bác sĩ cây trồng AI và sổ nợ mùa vụ — mọi thứ nhà nông cần trên một nền tảng.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6 md:mt-8 animate-fade-up stagger-5">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors"
          >
            Khám phá vật tư
          </Link>
          <Link
            to="/ai-doctor"
            className="inline-flex items-center gap-2 px-6 py-3 border border-brand-dark/25 text-brand-dark text-sm tracking-wide uppercase rounded-full hover:bg-white/70 transition-colors"
          >
            Chẩn đoán AI
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="w-full mt-10 md:mt-14 animate-fade-up stagger-5">
          <p className="text-left text-xs tracking-[0.25em] uppercase text-brand-dark/55 mb-5 md:mb-6 font-sans">
            Đối tác tin cậy
          </p>
          <div className="flex flex-wrap items-center justify-start gap-6 md:gap-12 lg:gap-16 animate-fade-up stagger-6">
            {partners.map((partner) => (
              <span
                key={partner.name}
                className={`text-lg md:text-xl lg:text-2xl text-brand-dark/75 whitespace-nowrap ${partner.className}`}
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
