import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { exchangesApi, exchangeStatus, type Exchange, type ExchangePage } from '../../api/exchangesApi'
import { usePermissions } from '../../context/PermissionContext'
import ExchangeRequestForm from './ExchangeRequestForm'
const money = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
const conditions: Record<string, string> = { PENDING_INSPECTION: 'Chưa kiểm tra', RESELLABLE: 'Còn bán được', DAMAGED: 'Hư hỏng', EXPIRED: 'Hết hạn', UNUSABLE: 'Không sử dụng được' }
const history: Record<string,string> = { EXCHANGE_REQUESTED: 'Đã gửi yêu cầu', EXCHANGE_APPROVE: 'Cửa hàng đã duyệt', EXCHANGE_REJECT: 'Cửa hàng từ chối', EXCHANGE_CANCEL: 'Đã hủy', EXCHANGE_RECEIVE: 'Đã nhận hàng thu hồi', EXCHANGE_INSPECT: 'Đã kiểm tra tình trạng', EXCHANGE_COMPLETE_INSPECTION: 'Đã chốt kiểm tra và chênh lệch', EXCHANGE_COMPLETE: 'Đã hoàn tất đổi hàng' }
export default function OrderExchangePanel({ orderId, completed }: { orderId: string; completed: boolean }) {
 const { hasPermission } = usePermissions()
 const [page, setPage] = useState(1); const [list, setList] = useState<ExchangePage | null>(null)
 const [selected, setSelected] = useState<Exchange | null>(null); const [creating, setCreating] = useState(false)
 const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [cancelReason, setCancelReason] = useState('')
 const read = hasPermission('MY_EXCHANGES.READ')
 const load = useCallback(async () => { if (!read) return; try { setList(await exchangesApi.list({ orderId, page })); setError('') } catch(e) { setError(e instanceof Error ? e.message : 'Không tải được yêu cầu đổi') } }, [orderId, page, read])
 useEffect(() => {
  if (!read) return
  let active = true
  exchangesApi.list({ orderId, page }).then(value => { if (active) { setList(value); setError('') } }).catch(error => { if (active) setError(error instanceof Error ? error.message : 'Không tải được yêu cầu đổi') })
  return () => { active = false }
 }, [orderId, page, read])
 const open = async (id: string) => { setBusy(true); setError(''); try { setSelected(await exchangesApi.get(id)) } catch(e) { setError(e instanceof Error ? e.message : 'Không tải được yêu cầu') } finally { setBusy(false) } }
 const cancel = async () => {
  if (!selected || !cancelReason.trim() || !window.confirm('Bác xác nhận hủy yêu cầu đổi hàng này?')) return
  setBusy(true); setError('')
  try { setSelected(await exchangesApi.action(selected.id, 'cancel', cancelReason.trim())); setCancelReason(''); await load() }
  catch(e) { setError(e instanceof Error ? e.message : 'Không hủy được yêu cầu') } finally { setBusy(false) }
 }
 if (!read && !hasPermission('MY_EXCHANGES.CREATE')) return null
 return <section className="border border-brand-dark/15 rounded-2xl bg-white p-5 md:p-7 space-y-5 mt-8">
  <div className="flex flex-wrap justify-between items-center gap-3"><h2 className="text-xl font-semibold">Đổi hàng</h2>{completed && hasPermission('MY_EXCHANGES.CREATE') && <button type="button" className="border border-brand-dark/30 rounded-full px-4 py-2" onClick={() => { setCreating(!creating); setSelected(null) }}>{creating ? 'Đóng biểu mẫu' : 'Yêu cầu đổi hàng'}</button>}</div>
  <p className="text-sm text-text-secondary">Cửa hàng thu hồi và kiểm tra hàng trước khi giao sản phẩm mới. Hàng đã trả hoặc đang đổi được trừ khỏi số lượng còn đủ điều kiện.</p>
  {error && <p role="alert" className="text-red-800 bg-red-50 p-3 rounded-lg">{error}</p>}
  {creating && <ExchangeRequestForm orderId={orderId} onCreated={e => { setCreating(false); setSelected(e); setPage(1); void load() }} />}
  {read && <><div className="space-y-3">{list?.items.map(e => <button type="button" key={e.id} disabled={busy} className="w-full text-left border rounded-xl p-4 flex flex-wrap justify-between gap-2 hover:bg-emerald-50" onClick={() => open(e.id)}><span>{e.returnNumber} · {new Date(e.createdAt).toLocaleDateString('vi-VN')}</span><span>{exchangeStatus[e.status]}</span></button>)}{list?.items.length === 0 && <p className="text-sm text-text-secondary">Chưa có yêu cầu đổi hàng cho đơn này.</p>}</div>
  {list && list.totalPages > 1 && <nav aria-label="Phân trang đổi hàng" className="flex gap-3 items-center"><button type="button" disabled={page <= 1 || busy} onClick={() => setPage(page - 1)}>Trang trước</button><span>{page} / {list.totalPages}</span><button type="button" disabled={page >= list.totalPages || busy} onClick={() => setPage(page + 1)}>Trang sau</button></nav>}</>}
  {selected && <div className="border-t pt-5 space-y-4"><div className="flex justify-between gap-3"><h3 className="font-semibold">{selected.return.returnNumber} · {exchangeStatus[selected.status]}</h3><button type="button" disabled={busy} onClick={() => open(selected.id)}>Làm mới</button></div><p>Lý do: {selected.reason}</p>
   <div className="grid sm:grid-cols-2 gap-3"><p>Giá trị hàng thu hồi: {money(selected.return.totalReturnAmount)}</p><p>Giảm công nợ: {money(selected.return.totalDebtAdjustment)}</p><p>Hàng thay thế: {money(selected.replacementAmount)}</p><p className="font-semibold">{selected.difference === null ? 'Tiền chênh lệch chờ kiểm tra' : selected.difference === 0 ? 'Đổi ngang giá' : `${selected.difference > 0 ? 'Bác thanh toán thêm' : 'Cửa hàng hoàn lại'}: ${money(Math.abs(selected.difference))}`}</p></div>
   <div><h4 className="font-semibold">Hàng thu hồi</h4>{selected.return.items.map((i,n) => <p key={i.id}>{selected.originalItems.find(o => o.orderItemId === i.orderItemId)?.productName ?? `Dòng ${n + 1}`}: {i.returnedBaseQuantity} đơn vị cơ sở · {conditions[i.conditionStatus]}{i.inspectionNote && ` · ${i.inspectionNote}`}</p>)}</div>
   <div><h4 className="font-semibold">Sản phẩm thay thế</h4>{selected.replacements.map(i => <p key={i.id}>{i.productName} · {i.packagingName} × {i.quantity} — {money(i.lineTotal)}</p>)}</div>
   {selected.replacementOrderId && <Link to={`/orders/${selected.replacementOrderId}`} className="underline">Xem đơn thay thế {selected.replacementOrderNumber}</Link>}
   <ol className="space-y-2 text-sm">{selected.history.map((h,n) => <li key={n}>{new Date(h.occurredAt).toLocaleString('vi-VN')} · {history[h.action] ?? 'Cập nhật yêu cầu'}{h.reason && ` · ${h.reason}`}</li>)}</ol>
   {selected.status === 'REQUESTED' && hasPermission('MY_EXCHANGES.CANCEL') && <div className="space-y-2"><label className="block">Lý do hủy<input className="border rounded-lg px-3 py-2 w-full" maxLength={1000} value={cancelReason} onChange={e => setCancelReason(e.target.value)} disabled={busy} /></label><button type="button" className="text-red-800 border rounded-full px-4 py-2 disabled:opacity-50" disabled={busy || !cancelReason.trim()} onClick={cancel}>Hủy yêu cầu đổi</button></div>}
  </div>}
 </section>
}
