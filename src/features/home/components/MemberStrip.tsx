import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'
import { ApiError } from '../../../api/client'
import { creditApi } from '../../../api/creditApi'
import { debtApi } from '../../../api/debtApi'
import { ordersApi } from '../../../api/ordersApi'
import type { DebtAccount, MyCreditSummary, OrderListItem, OrderStatus } from '../../../api/types'
import { formatVnd } from '../../../data/format'
import { ORDER_STATUS, labelOf } from '../../order/orderLabels'
import { formatDate } from '../../debt/debtLabels'

// Orders that are still moving; completed and cancelled ones are not "in progress".
const ACTIVE_STATUSES: OrderStatus[] = ['PENDING_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'READY_FOR_FULFILLMENT', 'PARTIALLY_FULFILLED']

// 404 means the farmer has no credit profile, which is "no debt book", not an error.
const orNull = <T,>(request: Promise<T>) =>
  request.catch((err: unknown) => {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  })

interface Summary {
  orders: { total: number; active: number; latest: OrderListItem | null } | null
  debt: { account: DebtAccount | null; credit: MyCreditSummary | null } | null
}

function greeting(hour: number) {
  if (hour < 11) return 'Chào buổi sáng'
  if (hour < 14) return 'Chào buổi trưa'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

/** Vietnamese names read family name first, so the given name is the last word. */
const givenName = (fullName: string) => fullName.trim().split(/\s+/).at(-1) ?? ''

function Tile({ to, label, children }: { to: string; label: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="focus-ring group flex flex-col justify-between gap-5 p-6 md:p-7 bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] hover:border-brand-dark/40 transition-colors duration-[var(--dur-standard)] min-h-[148px]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">{label}</span>
        <ArrowRight
          className="w-5 h-5 text-text-primary transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
      <div>{children}</div>
    </Link>
  )
}

const Pending = () => <div className="h-9 w-2/3 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" aria-hidden="true" />

/** Signed-in farmers see their own orders, debt and cart under the hero. Guests see nothing here. */
export default function MemberStrip() {
  const { isAuthenticated, farmer } = useAuth()
  const { itemCount, subtotal } = useCart()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [orderError, setOrderError] = useState(false)
  const [debtError, setDebtError] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    ordersApi
      .getOrders({ page: 1, pageSize: 30 })
      .then((res) => {
        if (cancelled) return
        const active = res.items.filter((o) => ACTIVE_STATUSES.includes(o.status)).length
        setSummary((prev) => ({ debt: prev?.debt ?? null, orders: { total: res.totalCount, active, latest: res.items[0] ?? null } }))
      })
      .catch(() => !cancelled && setOrderError(true))
    Promise.all([orNull(debtApi.getAccount()), orNull(creditApi.getMyCredit())])
      .then(([account, credit]) => !cancelled && setSummary((prev) => ({ orders: prev?.orders ?? null, debt: { account, credit } })))
      .catch(() => !cancelled && setDebtError(true))
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  const name = givenName(farmer.name)
  const orders = summary?.orders
  const debt = summary?.debt
  const latestStatus = orders?.latest ? labelOf(ORDER_STATUS, orders.latest.status) : null
  const balance = debt?.account?.currentBalance ?? debt?.credit?.outstandingReceivable ?? 0
  const overdue = debt?.account?.overdueAmount ?? 0
  const dueDate = debt?.account?.oldestDueDate

  return (
    <section aria-label="Tài khoản của bạn" className="relative z-20 pt-10 md:pt-14 pb-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <p className="text-lg md:text-xl font-light tracking-tight text-text-primary mb-4">
            {greeting(new Date().getHours())}
            {name ? `, bác ${name}` : ''}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <Tile to="/orders" label="Đơn hàng">
              {orderError ? (
                <p className="text-[15px] text-text-secondary">Chưa tải được đơn hàng.</p>
              ) : !orders ? (
                <Pending />
              ) : orders.total === 0 ? (
                <p className="text-[15px] text-text-secondary">Bác chưa có đơn hàng nào.</p>
              ) : (
                <>
                  <p className="text-3xl font-light tracking-tight text-text-primary">
                    {orders.active} <span className="text-base font-normal text-text-secondary">đơn đang xử lý</span>
                  </p>
                  {orders.latest && latestStatus && (
                    <p className="mt-1 text-[15px] text-text-secondary">
                      Gần nhất: {orders.latest.orderNumber} · {latestStatus.label}
                    </p>
                  )}
                </>
              )}
            </Tile>

            <Tile to="/debt" label="Sổ nợ">
              {debtError ? (
                <p className="text-[15px] text-text-secondary">Chưa tải được Sổ nợ.</p>
              ) : !debt ? (
                <Pending />
              ) : !debt.account && !debt.credit ? (
                <p className="text-[15px] text-text-secondary">Đại lý chưa cấp hạn mức mua chịu cho bác.</p>
              ) : (
                <>
                  <p className="text-3xl font-light tracking-tight text-text-primary">{formatVnd(balance)}</p>
                  <p className={`mt-1 text-[15px] ${overdue > 0 ? 'text-status-error font-medium' : 'text-text-secondary'}`}>
                    {overdue > 0
                      ? `Quá hạn ${formatVnd(overdue)}`
                      : balance > 0 && dueDate
                        ? `Hạn trả gần nhất: ${formatDate(dueDate)}`
                        : debt.credit
                          ? `Còn dùng được ${formatVnd(debt.credit.availableCredit)}`
                          : 'Không có khoản nợ nào'}
                  </p>
                </>
              )}
            </Tile>

            <Tile to="/cart" label="Giỏ hàng">
              {itemCount === 0 ? (
                <p className="text-[15px] text-text-secondary">Giỏ hàng đang trống.</p>
              ) : (
                <>
                  <p className="text-3xl font-light tracking-tight text-text-primary">
                    {itemCount} <span className="text-base font-normal text-text-secondary">sản phẩm</span>
                  </p>
                  <p className="mt-1 text-[15px] text-text-secondary">Tạm tính {formatVnd(subtotal)}</p>
                </>
              )}
            </Tile>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
