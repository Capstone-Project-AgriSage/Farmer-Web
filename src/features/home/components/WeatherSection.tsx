import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'

// Thới Lai, Cần Thơ. Data: Open-Meteo (free, no key). Its free tier is for non-commercial use and asks for attribution.
const URL =
  'https://api.open-meteo.com/v1/forecast?latitude=10.05&longitude=105.6' +
  '&current=temperature_2m,relative_humidity_2m,weather_code' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=Asia%2FHo_Chi_Minh&forecast_days=3'
const CACHE_KEY = 'agrisage.weather.thoi-lai'
const CACHE_MS = 10 * 60 * 1000

interface Weather {
  fetchedAt: number
  current: { temperature_2m: number; relative_humidity_2m: number; weather_code: number }
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] }
}

// WMO weather codes grouped into the few conditions a farmer cares about.
function describe(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Trời quang', icon: 'sunny' }
  if (code <= 2) return { label: 'Ít mây', icon: 'partly_cloudy_day' }
  if (code === 3) return { label: 'Nhiều mây', icon: 'cloud' }
  if (code <= 48) return { label: 'Sương mù', icon: 'foggy' }
  if (code <= 57) return { label: 'Mưa phùn', icon: 'rainy_light' }
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: 'Có mưa', icon: 'rainy' }
  if (code >= 95) return { label: 'Mưa dông', icon: 'thunderstorm' }
  return { label: 'Nhiều mây', icon: 'cloud' }
}

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

export default function WeatherSection() {
  const { weather, failed } = useWeather()
  // No weather, no card: the rest of the page does not depend on it.
  if (failed) return null

  const today = weather?.daily
  const rainToday = today?.precipitation_probability_max[0] ?? 0
  const humidity = weather?.current.relative_humidity_2m ?? 0
  const now = weather ? describe(weather.current.weather_code) : null
  // A prompt to go and look, not an agronomic claim.
  const wet = weather !== null && (humidity >= 85 || rainToday >= 60)

  return (
    <section className="w-full py-20 md:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Thời tiết ruộng" title="Thới Lai, Cần Thơ hôm nay" />

        <Reveal className="mt-10 md:mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-brand-dark/15 bg-white rounded-[var(--radius-surface)]">
            <div className="lg:col-span-5 p-7 md:p-10 border-b lg:border-b-0 lg:border-r border-brand-dark/15">
              {!weather || !now ? (
                <div className="space-y-4" aria-busy="true" aria-label="Đang tải thời tiết">
                  <div className="h-20 w-40 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                  <div className="h-6 w-56 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                  <div className="h-6 w-44 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 56 }} aria-hidden="true">
                      {now.icon}
                    </span>
                    <p className="text-7xl font-light tracking-tight text-text-primary leading-none">
                      {Math.round(weather.current.temperature_2m)}
                      <span className="text-3xl align-top">°C</span>
                    </p>
                  </div>
                  <p className="mt-4 text-xl text-text-primary">{now.label}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-6 max-w-xs">
                    <div>
                      <dt className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Độ ẩm</dt>
                      <dd className="mt-1 text-2xl font-light text-text-primary">{humidity}%</dd>
                    </div>
                    <div>
                      <dt className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Khả năng mưa</dt>
                      <dd className="mt-1 text-2xl font-light text-text-primary">{rainToday}%</dd>
                    </div>
                  </dl>
                </>
              )}
            </div>

            <div className="lg:col-span-7 p-7 md:p-10 flex flex-col justify-between gap-8">
              <ul className="grid grid-cols-3 divide-x divide-brand-dark/15" aria-label="Dự báo 3 ngày">
                {(today?.time ?? [0, 1, 2]).map((day, index) => {
                  const info = today ? describe(today.weather_code[index]) : null
                  return (
                    <li key={String(day)} className="px-3 sm:px-6 first:pl-0 last:pr-0 text-center sm:text-left">
                      {today && info ? (
                        <>
                          <p className="text-[15px] text-text-secondary">{dayLabel(String(day), index)}</p>
                          <span className="material-symbols-outlined mt-3 text-primary-dark" style={{ fontSize: 32 }} aria-hidden="true">
                            {info.icon}
                          </span>
                          <p className="mt-2 text-lg sm:text-xl font-light text-text-primary whitespace-nowrap">
                            {Math.round(today.temperature_2m_max[index])}°<span className="text-text-secondary">/{Math.round(today.temperature_2m_min[index])}°</span>
                          </p>
                          <p className="mt-1 text-[15px] text-text-secondary">Mưa {today.precipitation_probability_max[index]}%</p>
                        </>
                      ) : (
                        <div className="h-28 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" aria-hidden="true" />
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="border-t border-brand-dark/15 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-[15px] md:text-base text-text-secondary leading-relaxed max-w-md">
                  {wet
                    ? 'Trời ẩm hoặc có mưa: bác nên ra thăm ruộng và chụp ảnh lá nếu thấy đốm lạ.'
                    : 'Thời tiết hôm nay khá ổn. Bác vẫn nên thăm ruộng thường xuyên.'}
                </p>
                <Link
                  to="/ai-doctor"
                  className="focus-ring inline-flex items-center gap-2 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4 shrink-0"
                >
                  Chẩn đoán bệnh lúa
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-text-secondary">
            Dữ liệu thời tiết: Open-Meteo.com{weather ? ` · cập nhật ${new Date(weather.fetchedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
