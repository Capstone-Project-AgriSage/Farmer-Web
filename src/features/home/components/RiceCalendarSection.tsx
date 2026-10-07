import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { diagnosisScenarios, riceStageOptions, type RiceStageValue } from '../../ai-doctor/diagnosisScenarios'

// Stage names and day ranges come from the AI Doctor form; the disease per stage comes from its sample scenarios.
// PLACEHOLDER CONTENT for layout review: which disease to flag per stage, and which supplies to suggest, are for an
// agronomist to confirm before this ships.
const STAGE_ICONS: Record<RiceStageValue, string> = { seedling: 'grass', tillering: 'eco', panicle: 'spa', ripening: 'agriculture' }
const SUPPLY_LINK: Record<RiceStageValue, { label: string; to: string }> = {
  seedling: { label: 'Xem phân bón NPK & dinh dưỡng lúa', to: `/products?group=${encodeURIComponent('Phân bón NPK & Dinh dưỡng lúa')}` },
  tillering: { label: 'Xem thuốc đặc trị nấm & khuẩn', to: `/products?group=${encodeURIComponent('Thuốc đặc trị nấm & diệt khuẩn')}` },
  panicle: { label: 'Xem thuốc đặc trị nấm & khuẩn', to: `/products?group=${encodeURIComponent('Thuốc đặc trị nấm & diệt khuẩn')}` },
  ripening: { label: 'Xem thuốc đặc trị nấm & khuẩn', to: `/products?group=${encodeURIComponent('Thuốc đặc trị nấm & diệt khuẩn')}` },
}

const stages = riceStageOptions.map((option) => {
  const match = /^Giai đoạn (.+?) \((.+)\)$/.exec(option.label)
  return { value: option.value, name: match?.[1] ?? option.label, days: match?.[2] ?? '' }
})

export default function RiceCalendarSection() {
  const [index, setIndex] = useState(1)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const stage = stages[index]
  const scenario = diagnosisScenarios[stage.value]
  const hasDisease = scenario.diseaseId !== 'healthy'

  const move = (event: KeyboardEvent, from: number) => {
    const next = event.key === 'ArrowRight' ? from + 1 : event.key === 'ArrowLeft' ? from - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? stages.length - 1 : null
    if (next === null || next < 0 || next >= stages.length) return
    event.preventDefault()
    setIndex(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className="w-full py-20 md:py-28 bg-brand-light border-y border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Lịch vụ lúa" title="Ruộng của bác đang ở giai đoạn nào?" description="Chọn giai đoạn để xem điều cần để ý và vật tư tham khảo." />

        <Reveal className="mt-12 md:mt-16">
          {/* Track with four stops; the filled part follows the selected stage. */}
          <div className="relative">
            <div className="absolute left-[12.5%] right-[12.5%] top-[27px] h-px bg-brand-dark/20" aria-hidden="true" />
            <div
              className="absolute left-[12.5%] right-[12.5%] top-[27px] h-px bg-primary-dark origin-left transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)]"
              style={{ transform: `scaleX(${index / (stages.length - 1)})` }}
              aria-hidden="true"
            />
            <div role="tablist" aria-label="Giai đoạn sinh trưởng của lúa" className="relative grid grid-cols-4">
              {stages.map((item, i) => {
                const selected = i === index
                return (
                  <button
                    key={item.value}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    role="tab"
                    id={`stage-tab-${item.value}`}
                    aria-selected={selected}
                    aria-controls="stage-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setIndex(i)}
                    onKeyDown={(event) => move(event, i)}
                    className="focus-ring group flex flex-col items-center gap-3 px-1 pb-2 min-h-[88px]"
                  >
                    <span
                      className={`flex items-center justify-center w-14 h-14 rounded-full border transition-colors duration-[var(--dur-standard)] ${
                        selected ? 'bg-primary-dark border-primary-dark text-white' : i < index ? 'bg-white border-primary-dark text-primary-dark' : 'bg-brand-light border-brand-dark/25 text-text-secondary group-hover:border-brand-dark/60'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 26 }} aria-hidden="true">
                        {STAGE_ICONS[item.value]}
                      </span>
                    </span>
                    <span className={`text-[15px] md:text-base text-center leading-tight ${selected ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`stage-tab-${stage.value}`}
            key={stage.value}
            className="animate-fade-up mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-7 md:p-10"
          >
            <div className="md:col-span-4">
              <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Giai đoạn {index + 1}/4</p>
              <h3 className="mt-3 text-[length:var(--type-h2)] leading-[var(--type-h2-lh)] font-light tracking-tight text-text-primary">{stage.name}</h3>
              <p className="mt-2 text-[15px] md:text-base text-text-secondary">{stage.days}</p>
            </div>

            <div className="md:col-span-5">
              <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Điều cần để ý</p>
              {hasDisease ? (
                <>
                  <p className="mt-3 text-xl text-text-primary leading-snug">{scenario.diseaseName}</p>
                  <p className="mt-2 text-[15px] md:text-base text-text-secondary leading-relaxed">{scenario.symptomsDetected[0]}</p>
                </>
              ) : (
                <p className="mt-3 text-[15px] md:text-base text-text-secondary leading-relaxed">Chưa có cảnh báo riêng cho giai đoạn này. Bác theo dõi cây thường xuyên và chụp ảnh nếu thấy dấu hiệu lạ.</p>
              )}
            </div>

            <div className="md:col-span-3 flex flex-col gap-3 md:items-start justify-end">
              <Link to={SUPPLY_LINK[stage.value].to} className="focus-ring group inline-flex items-center gap-2 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4">
                {SUPPLY_LINK[stage.value].label}
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link to="/ai-doctor" className="focus-ring group inline-flex items-center gap-2 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4">
                Chụp ảnh lá lúa để chẩn đoán
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-text-secondary">Thông tin mang tính tham khảo. Bác hỏi kỹ sư nông học để biết chính xác cho ruộng của mình.</p>
        </Reveal>
      </div>
    </section>
  )
}
