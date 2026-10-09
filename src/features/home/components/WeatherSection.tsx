import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useInView } from 'framer-motion'
import Reveal from '../../../components/ui/Reveal'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'

// Thới Lai, Cần Thơ. Data: Open-Meteo (free, no key). Its free tier is for non-commercial use and asks for attribution.
const URL =
  'https://api.open-meteo.com/v1/forecast?latitude=10.05&longitude=105.6' +
  '&current=temperature_2m,relative_humidity_2m,weather_code,is_day' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=Asia%2FHo_Chi_Minh&forecast_days=3'
const CACHE_KEY = 'agrisage.weather.thoi-lai'
const CACHE_MS = 10 * 60 * 1000

interface Weather {
  fetchedAt: number
  // is_day was added later: an older cached answer may not have it, which reads as daytime.
  current: { temperature_2m: number; relative_humidity_2m: number; weather_code: number; is_day?: number }
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] }
}

type Mood = 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'storm'

// WMO weather codes grouped into the few conditions a farmer cares about.
function describe(code: number): { label: string; icon: string; mood: Mood } {
  if (code === 0) return { label: 'Trời quang', icon: 'sunny', mood: 'clear' }
  if (code <= 2) return { label: 'Ít mây', icon: 'partly_cloudy_day', mood: 'clear' }
  if (code === 3) return { label: 'Nhiều mây', icon: 'cloud', mood: 'cloudy' }
  if (code <= 48) return { label: 'Sương mù', icon: 'foggy', mood: 'fog' }
  if (code <= 57) return { label: 'Mưa phùn', icon: 'rainy_light', mood: 'drizzle' }
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: 'Có mưa', icon: 'rainy', mood: 'rain' }
  if (code >= 95) return { label: 'Mưa dông', icon: 'thunderstorm', mood: 'storm' }
  return { label: 'Nhiều mây', icon: 'cloud', mood: 'cloudy' }
}

// Background per mood. Photos: Deepavali Gaind (clear) and Sadek Husein (overcast), Unsplash License; rain reuses the
// overcast field under a darker tint with falling streaks drawn in CSS.
const PHOTO = {
  clear: { base: '/images/weather/weather-sunny', position: 'object-[50%_62%]' },
  overcast: { base: '/images/weather/weather-cloudy', position: 'object-[50%_58%]' },
}
// Solid tint over the photo so white text stays readable; darker for heavier weather and at night.
const TINT: Record<Mood, number> = { clear: 0.42, cloudy: 0.46, fog: 0.5, drizzle: 0.52, rain: 0.56, storm: 0.62 }

function readCache(): Weather | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Weather
    return Date.now() - parsed.fetchedAt < CACHE_MS ? parsed : null
  } catch {
    return null
  }
}

function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(() => readCache())
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (weather) return
    const controller = new AbortController()
    fetch(URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        const next: Weather = { fetchedAt: Date.now(), current: data.current, daily: data.daily }
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next))
        } catch {
          // Private mode or storage disabled: the card still works, it just refetches next time.
        }
        setWeather(next)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') setFailed(true)
      })
    return () => controller.abort()
  }, [weather])

  return { weather, failed }
}

function dayLabel(iso: string, index: number) {
  if (index === 0) return 'Hôm nay'
  if (index === 1) return 'Ngày mai'
  const weekday = new Date(`${iso}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'long' })
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}

const skeleton = 'bg-white/15 rounded-[var(--radius-surface)] animate-pulse'

/**
 * Full-width band whose photo, tint and rain follow the current weather in Thới Lai: a huge temperature, the condition,
 * the next three days and a prompt to check the field. While the band is off screen its animations are paused.
 */
export default function WeatherSection() {
  const { weather, failed } = useWeather()
  const policy = useMotionPolicy()
  const sectionRef = useRef<HTMLElement>(null)
  const onScreen = useInView(sectionRef, { margin: '100px 0px' })
  const [loadedPhoto, setLoadedPhoto] = useState<string | null>(null)

  // No weather, no band: the rest of the page does not depend on it.
  if (failed) return null

  const today = weather?.daily
  const rainToday = today?.precipitation_probability_max[0] ?? 0
  const humidity = weather?.current.relative_humidity_2m ?? 0
  const now = weather ? describe(weather.current.weather_code) : null
  const night = weather?.current.is_day === 0
  // A prompt to go and look, not an agronomic claim.
  const wet = weather !== null && (humidity >= 85 || rainToday >= 60)

  const mood = now?.mood
  const photo = mood === 'clear' && !night ? PHOTO.clear : PHOTO.overcast
  const photoSrc = `${photo.base}-1920.webp`
  const tint = mood ? Math.min(0.78, TINT[mood] + (night ? 0.16 : 0)) : 0
  const raining = mood === 'drizzle' || mood === 'rain' || mood === 'storm'

  return (
    <section
      ref={sectionRef}
      aria-labelledby="weather-title"
      className="relative w-full overflow-hidden bg-brand-dark text-white"
      data-paused={onScreen ? undefined : ''}
      data-static={policy === 'full' ? undefined : ''}
    >
      {/* Background: the photo fades in once it has loaded, then drifts very slowly (full motion only). */}
      {mood && (
        <div aria-hidden="true" className="absolute inset-0">
          <img
            key={photoSrc}
            src={photoSrc}
            srcSet={`${photo.base}-960.webp 960w, ${photo.base}-1920.webp 1920w`}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setLoadedPhoto(photoSrc)}
            className={`weather-drift absolute inset-0 w-full h-full object-cover ${photo.position} transition-opacity duration-[var(--dur-large)] ${
              loadedPhoto === photoSrc ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-brand-dark transition-opacity duration-[var(--dur-large)]" style={{ opacity: tint }} />
          {raining && (
            <>
              <div className="rain-layer rain-layer--far" />
              {mood !== 'drizzle' && <div className="rain-layer rain-layer--near" />}
            </>
          )}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 lg:min-h-[clamp(620px,86vh,800px)] flex flex-col gap-12 lg:gap-16 justify-between">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <Reveal as="p" y={12} className="text-[13px] uppercase tracking-[0.16em] text-white/80">
              Thời tiết ruộng
            </Reveal>
            <h2 id="weather-title" className="mt-2 text-[length:var(--type-h3)] leading-[var(--type-h3-lh)] font-normal tracking-tight text-white">
              Thới Lai, Cần Thơ{night ? ' · đêm nay' : ' · hôm nay'}
            </h2>
          </div>
          <p className="text-[13px] text-white/75">
            Dữ liệu: Open-Meteo.com
            {weather ? ` · cập nhật ${new Date(weather.fetchedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}
          </p>
        </div>

        {!weather || !now ? (
          <div className="space-y-5" aria-busy="true" aria-label="Đang tải thời tiết">
            <div className={`h-32 md:h-48 w-56 md:w-80 ${skeleton}`} />
            <div className={`h-7 w-64 ${skeleton}`} />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-14">
            <p className="text-[clamp(7rem,19vw,15rem)] leading-[0.8] font-extralight tracking-[-0.05em] text-white tabular-nums">
              {Math.round(weather.current.temperature_2m)}
              <span className="align-top text-[0.32em] leading-none tracking-normal">°C</span>
            </p>
            <div className="lg:pb-4">
              <p className="flex items-center gap-3 text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-light text-white">
                <span className="material-symbols-outlined" style={{ fontSize: 40 }} aria-hidden="true">
                  {now.icon}
                </span>
                {now.label}
              </p>
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-base text-white/85">
                <div className="flex gap-2">
                  <dt>Độ ẩm</dt>
                  <dd className="text-white">{humidity}%</dd>
                </div>
                <div className="flex gap-2">
                  <dt>Khả năng mưa hôm nay</dt>
                  <dd className="text-white">{rainToday}%</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 border-t border-white/25 pt-8">
          <ul className="lg:col-span-7 grid grid-cols-3 gap-3 sm:gap-8" aria-label="Dự báo 3 ngày">
            {(today?.time ?? ['0', '1', '2']).map((day, index) => {
              const info = today ? describe(today.weather_code[index]) : null
              return (
                <li key={String(day)}>
                  {today && info ? (
                    <>
                      <p className="text-[15px] text-white/80">{dayLabel(String(day), index)}</p>
                      <p className="mt-2 flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl font-light text-white whitespace-nowrap">
                        <span className="material-symbols-outlined" style={{ fontSize: 'clamp(20px, 2vw, 26px)' }} aria-hidden="true">
                          {info.icon}
                        </span>
                        <span>
                          {Math.round(today.temperature_2m_max[index])}°<span className="text-white/70">/{Math.round(today.temperature_2m_min[index])}°</span>
                        </span>
                      </p>
                      <p className="mt-1 text-[15px] text-white/80">
                        {info.label} · mưa {today.precipitation_probability_max[index]}%
                      </p>
                    </>
                  ) : (
                    <div className={`h-20 ${skeleton}`} aria-hidden="true" />
                  )}
                </li>
              )
            })}
          </ul>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-center lg:items-start xl:items-center justify-between gap-5">
            <p className="text-base leading-relaxed text-white/90 max-w-md">
              {wet
                ? 'Trời ẩm hoặc có mưa: bác nên ra thăm ruộng và chụp ảnh lá nếu thấy đốm lạ.'
                : 'Thời tiết hôm nay khá ổn. Bác vẫn nên thăm ruộng thường xuyên.'}
            </p>
            <Link
              to="/ai-doctor"
              className="focus-ring-light inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full bg-white text-brand-dark hover:bg-brand-light text-base transition-colors shrink-0"
            >
              Chẩn đoán bệnh lúa
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
