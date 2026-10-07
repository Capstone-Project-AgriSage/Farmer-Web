import { useEffect, useState } from 'react'
import type { FulfillmentType, OrderStatus } from '../../../api/types'

type StepState = 'done' | 'active' | 'pending' | 'warning'

interface ProgressStep {
  label: string
  state: StepState
  caption: string
}

interface OrderProgressProps {
  status: OrderStatus
  fulfillmentType: FulfillmentType
  /** Units handed over so far and units ordered, from the delivery notes and the order lines. */
  delivered: number
  total: number
  hasConfirmation: boolean
  hasDeliveries: boolean
}

// Mapping confirmed by the product owner:
// PENDING_CONFIRMATION = step 1 active; CONFIRMED = step 1 done; PREPARING = step 2 active;
// READY = step 3 active (wording differs for delivery and pick-up); PARTIALLY_FULFILLED = step 3 active with delivered/total;
// COMPLETED = step 4 done; PARTIALLY_CANCELLED = steps already done are kept and a terminal warning is shown.
// CANCELLED has no progress at all (see the cancellation card on the page).
export function buildSteps({ status, fulfillmentType, delivered, total, hasConfirmation, hasDeliveries }: OrderProgressProps): ProgressStep[] {
  const pickup = fulfillmentType === 'PICKUP'
  const handoverLabel = pickup ? 'Nhận hàng' : 'Giao hàng'
  const partial = `${pickup ? 'Đã nhận' : 'Đã giao'} một phần${total > 0 ? ` · ${delivered}/${total}` : ''}`

  if (status === 'PARTIALLY_CANCELLED') {
    // How far the order got before the rest was cancelled.
    const gotToHandover = delivered > 0
    const gotToPreparing = gotToHandover || hasDeliveries
    return [
      { label: 'Xác nhận đơn', state: hasConfirmation || gotToPreparing ? 'done' : 'pending', caption: hasConfirmation || gotToPreparing ? 'Đã xác nhận' : '' },
      { label: 'Chuẩn bị hàng', state: gotToPreparing ? 'done' : 'pending', caption: gotToPreparing ? 'Đã chuẩn bị' : '' },
      { label: handoverLabel, state: 'warning', caption: gotToHandover ? `${partial}` : 'Phần còn lại đã huỷ' },
      { label: 'Hoàn tất', state: 'pending', caption: '' },
    ].map((step, index) => (index === 2 && gotToHandover ? { ...step, caption: `${partial} · Phần còn lại đã huỷ` } : step)) as ProgressStep[]
  }

  const order: Record<string, number> = { PENDING_CONFIRMATION: 0, CONFIRMED: 0, PREPARING: 1, READY_FOR_FULFILLMENT: 2, PARTIALLY_FULFILLED: 2, COMPLETED: 3 }
  const current = order[status] ?? 0
  // CONFIRMED means step 1 itself is finished, but nothing has started on step 2 yet.
  const stepState = (index: number): StepState => {
    if (status === 'COMPLETED') return 'done'
    if (status === 'CONFIRMED' && index === 0) return 'done'
    if (index < current) return 'done'
    if (index === current && !(status === 'CONFIRMED' && index === 0)) return 'active'
    return 'pending'
  }

  const captions: Record<string, string> = {
    PENDING_CONFIRMATION: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PREPARING: 'Đang chuẩn bị',
    READY_FOR_FULFILLMENT: pickup ? 'Sẵn sàng nhận hàng' : 'Sẵn sàng giao hàng',
    PARTIALLY_FULFILLED: partial,
    COMPLETED: 'Hoàn tất',
  }

  const labels = ['Xác nhận đơn', 'Chuẩn bị hàng', handoverLabel, 'Hoàn tất']
  return labels.map((label, index) => {
    const state = stepState(index)
    let caption = ''
    if (index === 0 && (status === 'PENDING_CONFIRMATION' || status === 'CONFIRMED')) caption = captions[status]
    else if (index === 0 && state === 'done') caption = 'Đã xác nhận'
    else if (index === 1 && status === 'PREPARING') caption = captions.PREPARING
    else if (index === 1 && state === 'done') caption = 'Đã chuẩn bị'
    else if (index === 2 && (status === 'READY_FOR_FULFILLMENT' || status === 'PARTIALLY_FULFILLED')) caption = captions[status]
    else if (index === 2 && state === 'done') caption = pickup ? 'Đã nhận hàng' : 'Đã giao hàng'
    else if (index === 3 && status === 'COMPLETED') caption = captions.COMPLETED
    return { label, state, caption }
  })
}

const NODE: Record<StepState, string> = {
  done: 'bg-primary-dark border-primary-dark text-white',
  active: 'bg-brand-dark border-brand-dark text-white',
  pending: 'bg-brand-cream border-brand-dark/30 text-text-muted',
  warning: 'bg-status-warning-surface border-status-warning text-status-warning',
}

function Node({ state, index }: { state: StepState; index: number }) {
  return (
    <span className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border text-[15px] transition-colors duration-[var(--dur-image)] ${NODE[state]}`} aria-hidden="true">
      {state === 'done' ? (
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          check
        </span>
      ) : state === 'warning' ? (
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          priority_high
        </span>
      ) : (
        index + 1
      )}
    </span>
  )
}

export default function OrderProgress(props: OrderProgressProps) {
  const steps = buildSteps(props)
  // How far the filled line runs: through every finished step, up to the active or warning one.
  const reached = steps.reduce((last, step, index) => (step.state !== 'pending' ? index : last), 0)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(frame)
  }, [])
  const fill = drawn ? reached / (steps.length - 1) : 0

  return (
    <div aria-label="Tiến trình đơn hàng">
      <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-y-8 md:gap-x-4">
        {/* Desktop: one rule through the four nodes (they sit at 12.5%, 37.5%, 62.5% and 87.5%); the filled part draws in. */}
        <span aria-hidden="true" className="hidden md:block absolute top-4 left-[12.5%] right-[12.5%] h-px bg-brand-dark/20" />
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-4 left-[12.5%] w-[75%] h-px bg-primary-dark origin-left transition-transform duration-[var(--dur-large)] ease-[var(--motion-ease-out)]"
          style={{ transform: `scaleX(${fill})` }}
        />
        {steps.map((step, index) => (
          <li key={step.label} aria-current={step.state === 'active' ? 'step' : undefined} className="relative flex md:flex-col md:items-center md:text-center gap-4 md:gap-3">
            {/* Phones: a short connector under each node, filled when the next step has been reached. */}
            {index < steps.length - 1 && (
              <span aria-hidden="true" className={`md:hidden absolute left-4 top-8 -bottom-8 w-px ${index < reached ? 'bg-primary-dark' : 'bg-brand-dark/20'}`} />
            )}
            <Node state={step.state} index={index} />
            <div className="min-w-0">
              <p className={`text-base ${step.state === 'pending' ? 'text-text-muted' : 'text-text-primary font-medium'}`}>{step.label}</p>
              {step.caption && (
                <p className={`mt-0.5 text-[15px] ${step.state === 'warning' ? 'text-status-warning font-medium' : step.state === 'active' ? 'text-text-primary' : 'text-text-secondary'}`}>{step.caption}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
